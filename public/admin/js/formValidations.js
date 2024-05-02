function showFormValidAlert() {
  console.log("alert fun called...");
  $("#FormAlert").fadeIn();

  setTimeout(function () {
    $("#FormAlert").fadeOut();
  }, 5000);
}

// couponpage validation
// ============================
function validateCouponForm() {
  // Get form input values
  var code = document.getElementById("exampleInputName1").value;

  var discountAmount = parseFloat(
    document.getElementsByName("discount_amount")[0].value
  );
  var validFrom = new Date(document.getElementsByName("validFrom")[0].value);
  var validTo = new Date(document.getElementsByName("validTo")[0].value);
  var minimumSpend = parseFloat(
    document.getElementsByName("minimumSpend")[0].value
  );
  var maxUsers = parseInt(document.getElementsByName("maxUsers")[0].value);
  var description = document.getElementById("exampleTextarea1").value;
  var ValidErrMess = document.getElementById("ValidErrMess");

  // Check for blank space in all fields
  if (code.trim() === "" || description.trim() === "") {
    // alert("All fields must be filled out.");
    ValidErrMess.innerHTML = "All fields must be filled out.";
    showFormValidAlert();
    return false;
  }

  // Check for negative discount amount, minimum spend, and max users
  if (discountAmount < 0 || minimumSpend < 0 || maxUsers < 1) {
    // alert("Negative values are not allowed.");
    ValidErrMess.innerHTML = "Negative values are not allowed.";
    showFormValidAlert();
    return false;
  }

  // Check if validFrom is after or equal to validTo
  if (validFrom >= validTo) {
    // alert("Valid Date From must be earlier than Valid Date To.");
    ValidErrMess.innerHTML =
      "Valid Date From must be earlier than Valid Date To.";
    showFormValidAlert();
    return false;
  }

  // Check if maxUsers is a non-decimal number
  if (!Number.isInteger(maxUsers)) {
    // alert("Max Users cannot have decimal points.");
    ValidErrMess.innerHTML = "Max Users cannot have decimal points.";
    showFormValidAlert();
    return false;
  }

  //check code is valid using ajax with pass code

  // If all validation checks pass, allow form submission
  return true;
}

//category validations
// ======================
function categoryValidation() {
  const categoryName = document.getElementById("categoryName");
  const imageInput = document.getElementById("imageInput1");

  if (categoryName.value.trim() === "") {
    ValidErrMess.innerHTML = "Category Name must not be empty.";
    showFormValidAlert();
    return false;
  }

  if (!isNaN(parseInt(categoryName.value))) {
    ValidErrMess.innerHTML = "Category Name cannot be a valid integer.";
    showFormValidAlert();
    return false;
  }

  if (!imageInput.files || imageInput.files.length === 0) {
    ValidErrMess.innerHTML = "Please select an image.";
    showFormValidAlert();
    return false;
  }

  return true;
}

//add product Fields validations
// ================================
function validateProductForm() {
  const productName = document.getElementsByName("product_name")[0].value;
  const price = parseFloat(document.getElementsByName("price")[0].value);
  const stock = parseInt(document.getElementsByName("stock")[0].value);
  const description = document.getElementsByName("description")[0].value;
  const imageInputs = document.querySelectorAll(".imageInput");

  if (
    productName.trim() === "" ||
    isNaN(price) ||
    isNaN(stock) ||
    description.trim() === ""
  ) {
    // alert("All fields must be filled out.");
    ValidErrMess.innerHTML = "All fields must be filled out.";
    showFormValidAlert();
    return false;
  }

  if (price < 0 || stock < 0) {
    // alert("Price and Stock cannot have negative values.");
    ValidErrMess.innerHTML = "Price and Stock cannot have negative values.";
    showFormValidAlert();
    return false;
  }

  for (const imageInput of imageInputs) {
    if (!imageInput.files || imageInput.files.length === 0) {
      // alert("Please select images for all fields.");
      ValidErrMess.innerHTML = "Please select images for all fields.";
      showFormValidAlert();
      return false;
    }
  }

  return true;
}

//edit product form validations
function validateEditProductForm() {
  const productName = document.getElementsByName("product_name")[0].value;
  const price = parseFloat(document.getElementsByName("price")[0].value);
  const stock = parseInt(document.getElementsByName("stock")[0].value);
  const description = document.getElementsByName("description")[0].value;

  if (
    productName.trim() === "" ||
    isNaN(price) ||
    isNaN(stock) ||
    description.trim() === ""
  ) {
    // alert("All fields must be filled out.");
    ValidErrMess.innerHTML = "All fields must be filled out.";
    showFormValidAlert();
    return false;
  }

  if (price < 0 || stock < 0) {
    // alert("Price and Stock cannot have negative values.");
    ValidErrMess.innerHTML = "Price and Stock cannot have negative values.";
    showFormValidAlert();
    return false;
  }

  return true;
}

function validUserEditForm() {
  const userName = document.getElementById("userName").value;
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;

  if (userName.trim() === "" || fullName.trim() === "") {
    // alert("All fields must be filled out.");
    ValidErrMess.innerHTML = "All fields must be filled out.";
    showFormValidAlert();
    return false;
  }

  if (email.trim() === "") {
    // alert('Email cannot be blank. Please enter a valid email address.');
    ValidErrMess.innerHTML = "Email fields must be filled out.";
    showFormValidAlert();
    return false;
  } else {
    const emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (!emailPattern.test(emailValue)) {
      // alert('Invalid email address. Please enter a valid email.');
      ValidErrMess.innerHTML = "Invalid email address. Please enter a valid email.";
      showFormValidAlert();
      return false;
    }
  }

  return true
}
