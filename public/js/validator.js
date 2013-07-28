$(document).ready(function() {
	$.validator.addMethod("validEmailAddress", function(value, element) {
		if (value) {
			var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			return regex.test(value);
		} else {
			return true;
		}
	},"Adresse email non valide.");




	var requiredMessage = "Ce champ est obligatoire.";
	$("#contact").validate({
		rules: {
			"name": {
			  "required": true
			},
			"email": {
			  "required": true,
			  "validEmailAddress": true
			},
			"message" : {
				"required": true
			}
		},
   	messages: {
      "name": {required: requiredMessage},
      "email": {required: requiredMessage},
      "message": {required: requiredMessage}
    },
	});

});