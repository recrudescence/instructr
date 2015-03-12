javascript:

var rows = [];

rows.concat(document.getElementsByClassName("rowfirst"));
rows.concat(document.getElementsByClassName("rowodd"));
rows.concat(document.getElementsByClassName("row"));
var visible = false;

for (var i = 0; i < rows.length; i++) {
	rows[i].children[5].innerHTML += '<br><element id="clickBox"> click for reviews </element><br><element id="block" style="display:none;"> HELLO<br>HELLO<BR>HELLO<BR>!!! </element>'
}

document.getElementById("clickBox").addEventListener("click", displayBox, false);

function displayBox(zEvent) {
    if (visible == true)
		document.getElementById("block").style.display = "none";
	else
		document.getElementById("block").style.display = "inline";
	visible = !visible;
}

void 0

// current problem: isolated worlds. injecting the click for reviews thing places it into the webpage,
// but this is a different world from this .js. Thus, when we try to reach displayBox, we can't,
