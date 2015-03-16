/* load the deis v0.5
 * Calvin Wang
 * Don't blindly roll the dice on course selection -- view RateMyProfessor ratings on the 
 * Brandeis University course catalog. A convenient search link embeds below the professors name,
 * for now. 
 */

function main() {
	console.log("%c[load the deis v0.1]", "color: green");
	var profs = Object(); // hash

	parseCells(document.getElementsByClassName("rowfirst"));
	parseCells(document.getElementsByClassName("rowodd"));
	parseCells(document.getElementsByClassName("row"));
	
	function parseCells(rows) {

		for (var i = 0; i < rows.length; i++) {
			var cell 		= rows[i].children[5];
			var fullName 	= cell.innerText.replace(',', '');
			profs[fullName] = fullName;

			var name = profs[fullName].split(' ');
			cell.firstName	= name[1];
			cell.lastName	= name[0];

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
				this.profLink = 'http://www.ratemyprofessors.com' + link[0].toString().slice(39);

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
		popup.innerHTML = 'Professor not found!<br><a href="http://www.ratemyprofessors.com/AddTeacher.jsp" target="_blank">submit a rating?</a>';
		cell.innerHTML 	= cell.profInfo + cell.container.innerHTML;
		cell.appendChild(cell.hide);
	}

	function buildRatingDisplay(responseText, tmp, popup, cell) {

		tmp 			= document.createElement('div');
		tmp.innerHTML	= responseText;

		var overalls	= tmp.getElementsByClassName('grade');
		var miscs		= tmp.getElementsByClassName('rating');

		var overallQuality	= overalls[0].innerText;
		var averageGrade	= overalls[1].innerText;
		var hotness			= 'http://www.ratemyprofessors.com/'
								+ overalls[2].getElementsByTagName('img')[0].src.slice(39);

		var helpfulness	= miscs[0].innerText;
		var clarity		= miscs[1].innerText;
		var easiness	= miscs[2].innerText;

		tmp.remove();

		var overallDiv	= document.createElement('div');
		var miscDiv		= document.createElement('div');
		var linkToPage	= document.createElement('div');

		overallDiv.innerHTML	= '<b>Quality:</b> ' + overallQuality + '<br>'
									+ '<b>Average Grade:</b> ' + averageGrade + '<br>'
									+ '<b>Hotness:</b> <img src="' + hotness + '" height=10px><br>';
		miscDiv.innerHTML		= '<b>Helpfulness:</b> ' + helpfulness + '<br>'
									+ '<b>Clarity:</b> ' + clarity + '<br>'
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

			if (cell.firstName.indexOf(name) >= 0) {
				found = i;
				console.log("%c\tName matched with RMP result [" + name
					+ "] and BCC result [" + cell.firstName + "] at cell [" + i + "]", 
					"color: green");
			}

			return found;
		}
	}

}

main();