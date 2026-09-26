document.addEventListener("DOMContentLoaded", function () {
  const getStartedButton = document.getElementById("getStartedBtn");
  if (getStartedButton) {
    getStartedButton.addEventListener("click", function () {
      console.log("Get Started button clicked! Navigating to Sign Up page...");

      window.location.href = "../../auth/signup/signup.html";
    });
  } else {
    console.error('Error:Button with ID "getStartedBtn" not found.');
  }
});
