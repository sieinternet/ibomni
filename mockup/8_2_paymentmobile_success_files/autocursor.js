function autocursor() {
	var aForm = document.forms[0];
	if(aForm.elements[0]!=null) {
		var max = aForm.length;
		for(var i = 0; i < max; i++ ) {
			if(aForm.elements[i].type == "password" ||
					aForm.elements[i].type == "text" ||
					aForm.elements[i].type == "select-one" ||
					aForm.elements[i].type == "select-multiple" ||
					aForm.elements[i].type == "checkbox" ||
					aForm.elements[i].type == "radio" ||
					aForm.elements[i].type == "file") {
				aForm.elements[i].focus();
				break;
			}
		}
	}
}