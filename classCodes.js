function main() {
	var classCode = getClassCodes();
	//console.log("%c[class codes have been loaded]", "color: green");

	var listedDepts = document.getElementsByClassName('course-subjects')[0].getElementsByClassName('ng-scope');
	for (var i = 0; i < listedDepts.length; i++) {
		var deptName = listedDepts[i].getElementsByTagName('a')[0].innerText;
		var deptID = classCode[deptName];

		// get link to registrar
		if (typeof deptID == "number") {
			// this part: lol. webscraping at it's finest. probably a better way but... quick and dirty.
			var academicYear = document.getElementsByClassName('breadcrumb')[0].getElementsByTagName('li')[1].getElementsByTagName('a')[0].innerText.split(' ');
			var semester = academicYear[0];
			var year = academicYear[1];


			var link = "http://registrar-prod.unet.brandeis.edu/registrar/schedule/classes/" 
						+ year + "/" + semester + "/" + deptID + "/UGRD"
			//console.log(link);
		}
	}

}

function getClassCodes() {
	var tmp = new Object();
	tmp['African and Afro-American Studies'] = 100;
	tmp['American Studies'] = 200;
	tmp['Anthropology'] = 300;
	tmp['Arabic Language and Literature'] = 400;
	tmp['Art History'] = 450;
	tmp['Biochemistry'] = 500;
	tmp['Biochemistry and Biophysics'] = 510;
	tmp['Biological Physics'] = 600;
	tmp['Biology'] = 700;
	tmp['Biophysics and Structural Biology'] = 810;
	tmp['Business'] = 900;
	tmp['Chemistry'] = 1000;
	tmp['Chinese'] = 1100;
	tmp['Classical Studies'] = 1200;
	tmp['Coexistence and Conflict'] = 1225;
	tmp['Comparative Humanities'] = 1250;
	tmp['Comparative Literature and Culture'] = 1300;
	tmp['Computer Science'] = 1400;
	tmp['Creative Writing'] = 1425;
	tmp['East Asian Studies'] = 1500;
	tmp['Economics'] = 1600;
	tmp['Education'] = 1700;
	tmp['English'] = 1800;
	tmp['English as a Second Language'] = 1850;
	tmp['Environmental Studies'] = 1900;
	tmp['European Cultural Studies'] = 2000;
	tmp['Film, Television and Interactive Media'] = 2100;
	tmp['Fine Arts'] = 2300;
	tmp['First Year Seminars (FYS)'] = 8000;
	tmp['French and Francophone Studies'] = 2400;
	tmp['Genetic Counseling'] = 2450;
	tmp['German Studies'] = 2500;
	tmp['German, Russian, and Asian Languages and Literature'] = 2525;
	tmp['Global Studies'] = 2535;
	tmp['Greek'] = 2550;
	tmp['Health: Science, Society, and Policy'] = 2700;
	tmp['Hebrew'] = 2800;
	tmp['Heller School for Social Policy and Management'] = 2900;
	tmp['Hispanic Studies'] = 6600;
	tmp['History'] = 3000;
	tmp['History of Ideas'] = 3100;
	tmp['Hornstein Jewish Professional Leadership Program'] = 3200;
	tmp['Independent Interdisciplinary Major'] = 3300;
	tmp['International and Global Studies'] = 3400;
	tmp['International Business School'] = 3600;
	tmp['Internship'] = 3700;
	tmp['Islamic and Middle Eastern Studies'] = 3900;
	tmp['Italian Studies'] = 4000;
	tmp['Japanese'] = 4100;
	tmp['Journalism'] = 4200;
	tmp['Justice Brandeis Semester'] = 4225;
	tmp['Korean'] = 4235;
	tmp['Language and Linguistics'] = 4600;
	tmp['Latin'] = 4250;
	tmp['Latin American and Latino Studies'] = 4300;
	tmp['Legal Studies'] = 4400;
	tmp['Mathematics'] = 4700;
	tmp['Medieval and Renaissance Studies'] = 4800;
	tmp['Molecular and Cell Biology'] = 4900;
	tmp['Music'] = 5000;
	tmp['Near Eastern and Judaic Studies'] = 5100;
	tmp['Neuroscience'] = 5200;
	tmp['Peace, Conflict, and Coexistence Studies'] = 5300;
	tmp['Philosophy'] = 5400;
	tmp['Physical Education'] = 5500;
	tmp['Physics'] = 5600;
	tmp['Politics'] = 5700;
	tmp['Postbaccalaureate Premedical Studies'] = 5800;
	tmp['Psychology'] = 5900;
	tmp['Quantitative Biology'] = 5950;
	tmp['Religious Studies'] = 6000;
	tmp['Romance Studies'] = 6100;
	tmp['Russian Studies'] = 6300;
	tmp['Sculpture'] = 6325;
	tmp['Sexuality and Queer Studies'] = 6350;
	tmp['Social Justice and Social Policy'] = 6400;
	tmp['Sociology'] = 6500;
	tmp['South Asian Studies'] = 6550;
	tmp['Spanish Language and Literature'] = 6625;
	tmp['Studio Art'] = 6675;
	tmp['Theater Arts'] = 6700;
	tmp['University Writing (COMP and UWS)'] = 7050;
	tmp['Women\'s and Gender Studies'] = 6900;
	tmp['Yiddish'] = 7000;
	return tmp;
}


if (window.location.href.split('/')[2] == "brandeis.schdl.net") {
	main();
}