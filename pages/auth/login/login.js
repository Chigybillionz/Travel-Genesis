document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  const passwordInput = document.querySelector("#password");
  const eyeToggle = document.querySelector("#eyeToggle");
  const email = document.querySelector("#email");

  // Toggle password visibility (SVG-based)
  if (eyeToggle && passwordInput) {
    eyeToggle.addEventListener("click", function () {
      const eyeClosed = eyeToggle.querySelector(".eye-closed");
      const eyeOpen = eyeToggle.querySelector(".eye-open");
      const currentType = passwordInput.getAttribute("type");

      if (currentType === "password") {
        passwordInput.setAttribute("type", "text");
        eyeClosed.style.display = "none";
        eyeOpen.style.display = "block";
      } else {
        passwordInput.setAttribute("type", "password");
        eyeClosed.style.display = "block";
        eyeOpen.style.display = "none";
      }
    });
  }

  // Form validation
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;
      let errorMessage = "";

      // Reset border colors
      email.classList.remove("error-border");
      passwordInput.classList.remove("error-border");

      // Check Email
      if (email.value.trim() === "" || !email.value.includes("@")) {
        isValid = false;
        errorMessage += "- Please enter a valid email address.\n";
        email.classList.add("error-border");
      }

      // Check Password
      if (passwordInput.value.trim() === "") {
        isValid = false;
        errorMessage += "- Please enter a password.\n";
        passwordInput.classList.add("error-border");
      }

      if (isValid) {
        window.location.href =
          "../../auth/confirmation/confirmation.html";
        console.log("Login attempt:", {
          email: email.value,
          password: passwordInput.value,
        });
      } else {
        alert("Please fix the following errors:\n" + errorMessage);
      }
    });
  }

  // Clear error styling on input
  [email, passwordInput].forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("error-border");
    });
  });
});
