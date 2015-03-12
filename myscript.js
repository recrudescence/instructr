javascript:

var x = document.getElementsByClassName("rowfirst");


for (var i = 0; i < x.length; i++) {
	var text = x[i].children[5].innerHTML;
	x[i].children[5].innerHTML = 
		text + '<br><element id="demo" onclick="displayBox()"> click for reviews </element><br><element id="block" style="display:none;"> HELLO<br>HELLO<BR>HELLO<BR>!!! </element>'
}

void 0