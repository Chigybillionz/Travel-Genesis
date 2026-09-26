document.addEventListener("DOMContentLoaded", function () {
  const startExploringBtn = document.querySelector(".btn");

  if (startExploringBtn) {
    startExploringBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Optional: Add a fade-out animation before navigation
      document.body.style.opacity = "1";
      document.body.style.transition = "opacity 0.3s ease";

      setTimeout(() => {
        document.body.style.opacity = "0";
      }, 10);

      setTimeout(() => {
        window.location.href = "../../booking/home/home.html";
      }, 300);
    });
  }
});
