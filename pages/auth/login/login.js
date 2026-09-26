document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  const passwordInput = document.querySelector("#password");
  const eyeIcon = document.querySelector("#eyeicon");
  const email = document.querySelector("#email");
  const signupLink = document.querySelector("#signup-link");

  // Toggle password visibility
  if (eyeIcon && passwordInput) {
    eyeIcon.addEventListener("click", function () {
      const currentType = passwordInput.getAttribute("type");
      if (currentType === "password") {
        // Password is currently HIDDEN, so we're going to SHOW it
        passwordInput.setAttribute("type", "text");
        eyeIcon.src = "../../../assets/icons/eye-open.png"; // Open eye
        eyeIcon.alt = "Hide password";
      } else {
        // Password is currently VISIBLE, so we're going to HIDE it
        passwordInput.setAttribute("type", "password");
        eyeIcon.src = "../../../assets/icons/eye-close.png"; // Closed eye
        eyeIcon.alt = "Show password";
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

  // Handle sign up link click
  if (signupLink) {
    signupLink.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Sign up link clicked! Navigating to Sign Up page...");
      window.location.href = "../../auth/signup/signup.html";
    });
  }
});
