
function validateForm() {
    error = 0;

    if ($('#Fname').val() == "") {
        error = 1;
        alert("Please enter First name");
        return false;
    }

    if ($('#Lname').val() == "") {
        error = 1;
        alert("Please enter Last name");
        return false;
    }

    if ($('#Email').val() == "") {
        error = 1;
        alert("Please enter Email name");
        return false;
    }

    if ($('#password').val() != $('#confirm_password').val()) {
        error = 1;
        alert("password do not match");
        return false;
    }

    if(error==0){
        return true;
    }

}