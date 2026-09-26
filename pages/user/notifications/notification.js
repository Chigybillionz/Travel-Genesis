document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.querySelector("#back-button");
  if (backButton) {
    backButton.addEventListener("click", function () {
      console.log("Back button clicked! Navigating to Home page...");
      window.location.href = "../../booking/home/home.html";
    });
  }
});
