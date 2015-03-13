/* load the deis
 * Calvin Wang
 * Don't blindly roll the dice on course selection -- view RateMyProfessor ratings on the 
 * Brandeis University course catalog. A convenient search link embeds below the professors name,
 * for now. 
 */

function main() {
	console.log("[load the deis v0.1]");
	var profs = Object(); // hash
	//document.getElementsByClassName("rowfirst")[0].children[5]
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

			var search 		= 'http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=Brandeis+University&schoolID=129&query='
								+ cell.lastName;
			cell.innerHTML	+= '<br><a href="' + search + '" target="_blank"><img src="http://i.imgur.com/tXxl77D.png" height=32 width=32></a>';
/*

			cell.innerHTML	+= '<br><input type="button" class="getRatings" value="click for reviews!">';
			
			cell.searchLink	= 'http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=Brandeis+University&schoolID=129&query='
								+ cell.firstName + "%20" + cell.lastName;
			cell.profLink	= '';
			cell.clicked	= false;
			cell.container 	= document.createElement('div');
			cell.addEventListener('click', showRatings);*/
		}
	}
/*
	function showRatings() {
		if (this.clicked == true) {
			this.container.innerHTML = '';
			this.innerHTML 	= this.profInfo + '<br><input type="button" class="getRatings" value="click for reviews!">';
			this.clicked 	= !this.clicked;
		} else {
			this.clicked 	= !this.clicked;
			var popup       = document.createElement('div');
			popup.className = 'popup';
			popup.innerText = 'Loading...';
			var firstName   = this.firstName;
			this.container.style.position = 'relative';
			this.container.appendChild(popup);
			console.log(this.searchLink);

			this.innerHTML 	= this.profInfo + this.container.innerHTML + '<br><input type="button" class="getRatings" value="click to hide!">'
		}
	}*/
}

main();