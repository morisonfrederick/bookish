function showFormValidAlert() {
    console.log("alert fun called...");
    $("#FormAlert").fadeIn();
  
    setTimeout(function () {
      $("#FormAlert").fadeOut();
    }, 5000);
  }
  

  function userProfieValidation() {
    var userName = document.getElementsByName("userName")[0].value;
    var fullName = document.getElementsByName("fullName")[0].value;
    var email = document.getElementsByName("email")[0].value;
    var pincode = document.getElementsByName("pincode")[0].value;
    var ValidErrMess = document.getElementById("ValidErrMess");

    if (!userName.trim() || !fullName.trim() || !email.trim()) {
        // alert("All fields marked with '*' must be filled out.");
        ValidErrMess.innerHTML = "All fields marked with '*' must be filled out.";
        showFormValidAlert()
        return false;
    }

    if (!validateEmail(email)) {
        // alert("Invalid email address.");
        ValidErrMess.innerHTML = "Invalid email address.";
        showFormValidAlert()
        return false;
    }

    if (pincode.trim() && !validatePincode(pincode)) {
        // alert("Invalid pin code. It should be a valid number.");
        ValidErrMess.innerHTML = "Invalid pin code. It should be a valid number.";
        showFormValidAlert()
        return false;
    }

    return true;
}

function validateEmail(email) {
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

// function validatePincode(pincode) {
//     return !isNaN(pincode);
// }




function validateUserAddressForm() {
    var address1 = document.getElementById("address1").value;
    var address2 = document.getElementById("address2").value;
    var address3 = document.getElementById("address3").value;
    var country = document.getElementById("country").value;
    var city = document.getElementById("stateadd").value;
    var county = document.getElementById("pincodeadd").value;
    var pin = document.getElementById("pin").value;
    var ValidErrMess = document.getElementById("ValidErrMess");


    if (!address1.trim() || !address2.trim() || !address3.trim() || !city.trim() || !county.trim() || !pin.trim()) {
        // alert("All fields marked as required must be filled out.");
        ValidErrMess.innerHTML = "All fields are Required must be filled out"
        showFormValidAlert()
        return false;
    }

    if (!validateMobileNumber(mobileNumber)) {
        // alert("Invalid mobile number. It should be a valid number between 10 and 12 digits.");
        ValidErrMess.innerHTML = "Invalid mobile number. It should be a valid number between 10 and 12 digits."
        showFormValidAlert()
        return false;
    }

    if (!validatePincode(pincode)) {
        // alert("Invalid pin code. It should be a valid 6-digit number.");
        ValidErrMess.innerHTML = "Invalid pin code. It should be a valid 6-digit number."
        showFormValidAlert()
        return false;
    }

    return true;
}

function validateMobileNumber(mobileNumber) {
    mobileNumber = mobileNumber.replace(/\D/g, "");
    return mobileNumber.length >= 10 && mobileNumber.length <= 12;
}

function validatePincode(pincode) {
    return !isNaN(pincode);
}



function validateUserAddressFormUpdate() {
    var country = document.getElementById("Countryedit").value;
    var fullName = document.getElementById("fullNameedit").value;
    var mobileNumber = document.getElementById("mobileNumberedit").value;
    var city = document.getElementById("cityedit").value;
    var state = document.getElementById("stateedit").value;
    var pincode = document.getElementById("pincodeedit").value;
    var ValidErrMess = document.getElementById("ValidErrMess");


    if (!country.trim() || !fullName.trim() || !mobileNumber.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
        // alert("All fields marked as required must be filled out.");
        ValidErrMess.innerHTML = "All fields are Required must be filled out"
        showFormValidAlert()
        return false;
    }

    if (!validateMobileNumber(mobileNumber)) {
        // alert("Invalid mobile number. It should be a valid number between 10 and 12 digits.");
        ValidErrMess.innerHTML = "Invalid mobile number. It should be a valid number between 10 and 12 digits."
        showFormValidAlert()
        return false;
    }

    if (!validatePincode(pincode)) {
        // alert("Invalid pin code. It should be a valid 6-digit number.");
        ValidErrMess.innerHTML = "Invalid pin code. It should be a valid 6-digit number."
        showFormValidAlert()
        return false;
    }

    return true;
}