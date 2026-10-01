document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.querySelector("#back-btn");
  if (backButton) {
    backButton.addEventListener("click", function () {
      console.log("Back button clicked! Navigating to Home page...");
      window.location.href = "../../booking/home/home.html";
    });
  }
});
