document.addEventListener("DOMContentLoaded", () => {
  const nextButton = document.getElementById("nextBtn");
  if (nextButton) {
    nextButton.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "/onboarding-2";
    });
  }

  const skipButton = document.getElementById("skipBtn");
  if (skipButton) {
    skipButton.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "/signup";
    });
  }
});
