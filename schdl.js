/* load the deis v1.1
 * Calvin Wang
 * Don't blindly roll the dice on course selection -- view RateMyProfessor ratings on the 
 * Brandeis University course catalog. A convenient search link embeds below the professors name,
 * for now. 
 */

function main() {
	var ltd_v = '1.1'

	console.log("%c[load the deis v" + ltd_v + "s]", "color: green");
	var profs = Object(); // hash

	insertNote();

	parseCells(document.getElementsByClassName("schdl-instructors"));
	
	function parseCells(instructors) {

		for (var i = 0; i < instructors.length; i++) {
			var cell 		= instructors[i].getElementsByClassName('ng-binding')[0];
			var fullName 	= cell.getElementsByTagName('a')[0].innerText.replace(',', '');
			profs[fullName] = fullName;

			var name = profs[fullName].split(' ');
			cell.firstName	= name[0];

			if (name[0] === "Novack")	cell.lastName = 'Novak';
			else 						cell.lastName = name[name.length-1];

			cell.profInfo	= cell.innerHTML;

			cell.innerHTML 	= cell.profInfo
							+ '<br><input type="button" class="getRatings" value="click for reviews!">';

			// search for last name first, because first names can be shortened
			cell.searchLink	= 'http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=Brandeis+University&schoolID=129&query='
							+ cell.lastName;
			cell.profLink	= '';
			cell.clicked	= false;
			cell.container 	= document.createElement('div');
			cell.addEventListener('click', showRatings);
		}
	}

	// TODO: clean up and refactor this pathetic mess of a method
	function showRatings() {
		cell = this;
		this.removeEventListener('click', showRatings);

		var popup       = document.createElement('div');
		popup.className = 'popup';
		popup.innerText = 'Loading...';
		cell.container.style.position = 'relative';
		cell.container.appendChild(popup);

		console.log("%cQUERY: " + cell.searchLink, "color: blue");
		
		chrome.runtime.sendMessage({
			url: cell.searchLink,
		}, function(responseText) {
			// temporary div so we can search its HTML
			var tmp 		= document.createElement('div');
			tmp.innerHTML	= responseText;
			var profs		= tmp.getElementsByClassName('listing PROFESSOR'); 

			if (profs.length < 1) {
				notFound(popup, cell);
			} else {
				console.log(profs);


				found = findProfessor(profs, cell);

				if (found == -1) {
					console.log("%c\tNo matching first names!", "color: red");
					notFound(popup, cell);
					return 0;
				}

				var link = profs[found].getElementsByTagName('a');
				this.profLink = 'http://www.ratemyprofessors.com' + link[0].toString().slice(26);

				console.log("ACCESS: " + this.profLink);

				chrome.runtime.sendMessage({
					url: this.profLink,
				}, function(responseText) {
					buildRatingDisplay(responseText, tmp, popup, cell);
				});
			}
		})
	}

	function notFound(popup, cell) {
		console.log("%c\tNo such professor found!", "color: red");

		// TODO: prepopulate the form for easier adding
		popup.innerHTML = '<b>Professor not found!</b><br>Submit a <a href="http://www.ratemyprofessors.com/AddTeacher.jsp" target="_blank">rating</a> or <a href="http://goo.gl/forms/W7ym0cxpHT" target="_blank">correction?</a>';
		cell.innerHTML 	= cell.profInfo + cell.container.innerHTML;
	}

	function buildRatingDisplay(responseText, tmp, popup, cell) {

		tmp 			= document.createElement('div');
		tmp.innerHTML	= responseText;

		var overalls	= tmp.getElementsByClassName('grade');
		var miscs		= tmp.getElementsByClassName('rating');

		var overallQuality	= overalls[0].innerText;
		var averageGrade	= overalls[1].innerText;
		var hotness			= 'http://www.ratemyprofessors.com/'
							+ overalls[2].getElementsByTagName('img')[0].src.slice(26);

		var helpfulness	= miscs[0].innerText;
		var clarity		= miscs[1].innerText;
		var easiness	= miscs[2].innerText;

		tmp.remove();

		var overallDiv	= document.createElement('div');
		var miscDiv			= document.createElement('div');
		var linkToPage	= document.createElement('div');

		overallDiv.innerHTML	= '<b>Quality:</b> ' + overallQuality + ' '
						 		+ '<b>Average Grade:</b> ' + averageGrade + ' '
						 		+ '<b>Hotness:</b> <img src="' + hotness + '" height=15px> ';
		miscDiv.innerHTML		= '<b>Helpfulness:</b> ' + helpfulness + ' '
						 		+ '<b>Clarity:</b> ' + clarity + ' '
						 		+ '<b>Easiness:</b> ' + easiness;
		linkToPage.innerHTML	= '<a href="' + this.profLink + '" target="_blank"><i>details</i></a>';

		cell.container.appendChild(overallDiv);
		cell.container.appendChild(miscDiv);
		cell.container.appendChild(linkToPage);

		popup.innerHTML	= '';
		cell.innerHTML	= cell.profInfo + cell.container.innerHTML;
	}

	function findProfessor(profs, cell) {
		for (var i = 0; i < profs.length; i++) {
			// make another temp div so we can analyze its HTML
			var tmp2 		= document.createElement('div');
			tmp2.innerHTML 	= profs[i].innerHTML;
			var name 		= tmp2.getElementsByClassName('main')[0].innerText.split(' ')[1];
			var found 		= -1;

			if (cell.firstName.indexOf(name) >= 0 || (cell.firstName === 'James' && name === 'Jim')) {
				found = i;
				console.log("%c\tName matched with RMP result [" + name
					+ "] and BCC result [" + cell.firstName + "] at cell [" + i + "]", 
					"color: green");
			}

			return found;
		}
	}

	function insertNote() {
		var notes = document.createElement('div');

		notes.innerHTML = "</div><br><b>Notes for [load-the-deis v" + ltd_v + "] Users</b>"
			+ "<div class=\"notescontent\"><small>"
			+ " <font color=red>NOTE FOR SCHDL: you have to reload the page if you navigate"
			+ " to another class page. This is because schdl is weird.</font><br>"
			+ " Hello and thank you for using my first ever "
			+ " Chrome extension! I hope you like it.<br>" 
			+ " If you notice a professor is listed on the course catalog and does not" 
			+ " correctly appear in the results, please let me know by filling out" 
			+ " <b><a href=\"http://goo.gl/forms/W7ym0cxpHT\">this form</a></b>!" 
			+ " Sometimes the profile page for the professor on RateMyProfessor has an incorrect/different" 
			+ " name or spelling :/ For example, Professor Morris is 'James' here and 'Jim' on RMP, and "
			+ " Professor Novack is spelled Novack here but Novak on RMP.<br>" 

			+ " Aside from that, I hope you enjoy the extension!"
			+ " I may add an option for pulling rating information from the official" 
			+ " <a href=\"https://apps.brandeis.edu//ceg/index\"><b>Brandeis Course Evaluations</b></a>" 
			+ " database." 

			+ " In the meantime -- feel free to let me know at <b>spiderman@brandeis.edu</b> if" 
			+ " you have any comments or suggestions!<br> ~*~ tell your friends ~*~<br>" 
			+ "	&nbsp;&nbsp;&nbsp;Cheers! ~Calvin</small>"
			+ "</div>";

		document.getElementsByClassName('breadcrumb')[0].appendChild(notes);

	}

}

if (window.location.href.split('/')[2] == "brandeis.schdl.net") {
	// Select all links
	//var allLinks = document.querySelectorAll('a[href]');
	var allLinks = document.links;

	// Bind the event handler to each link individually
	for (var i = 0, n = allLinks.length; i < n; i++) {
	    //allLinks[i].addEventListener('click', function (event) {});
	    allLinks[i].onclick = function () {
	        if (window.location.href.split('/')[3] == "course") {
	        	window.location.href = allLinks[i];
	        	console.log('reloaded')
	        }
	    };
	}

	main();
}