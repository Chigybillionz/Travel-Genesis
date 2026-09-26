document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#signupForm");
  const termsCheckbox = document.querySelector("#terms");
  const signupBtn = document.querySelector("#submitBtn");
  const passwordInput = document.querySelector("#password");
  const eyeIcon = document.querySelector("#eyeicon");
  const fullnameInput = document.querySelector("#fullname");
  const emailInput = document.querySelector("#email");

  // Password visibility toggle
  if (eyeIcon && passwordInput) {
    eyeIcon.addEventListener("click", function () {
      const currentType = passwordInput.getAttribute("type");
      if (currentType === "password") {
        passwordInput.setAttribute("type", "text");
        eyeIcon.src = "../../../assets/icons/eye-open.png";
        eyeIcon.alt = "Hide password";
      } else {
        passwordInput.setAttribute("type", "password");
        eyeIcon.src = "../../../assets/icons/eye-close.png";
        eyeIcon.alt = "Show password";
      }
    });
  }

  // Button state toggle
  function toggleButtonState() {
    if (termsCheckbox.checked) {
      signupBtn.classList.add("is-active");
      signupBtn.disabled = false;
    } else {
      signupBtn.classList.remove("is-active");
      signupBtn.disabled = true;
    }
  }

  termsCheckbox.addEventListener("change", toggleButtonState);

  // Form validation and submission
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;
      let errorMessage = "";

      // Reset border colors
      fullnameInput.classList.remove("error-border");
      emailInput.classList.remove("error-border");
      passwordInput.classList.remove("error-border");

      // Check Full Name
      if (fullnameInput.value.trim() === "") {
        isValid = false;
        errorMessage += "- Please enter your full name.\n";
        fullnameInput.classList.add("error-border");
      }

      // Check Email
      if (emailInput.value.trim() === "" || !emailInput.value.includes("@")) {
        isValid = false;
        errorMessage += "- Please enter a valid email address.\n";
        emailInput.classList.add("error-border");
      }

      // Check Password
      if (passwordInput.value.trim() === "") {
        isValid = false;
        errorMessage += "- Please enter a password.\n";
        passwordInput.classList.add("error-border");
      }

      // Check Terms & Conditions
      if (!termsCheckbox.checked) {
        isValid = false;
        errorMessage += "- You must agree to the Terms & Conditions.\n";
      }

      if (isValid) {
        // **STORE THE USER'S NAME AND EMAIL**
        const fullName = fullnameInput.value.trim();
        const firstName = fullName.split(" ")[0]; // Get first name only
        const email = emailInput.value.trim(); // Get email

        // Save to localStorage
        localStorage.setItem("userName", firstName);
        localStorage.setItem("userFullName", fullName);
        localStorage.setItem("userEmail", email); // Save email

        // Debug: Log to console to verify
        console.log("Saved to localStorage:");
        console.log("Full Name:", fullName);
        console.log("Email:", email);

        // Redirect to confirmation page
        window.location.href =
          "../../auth/confirmation/confirmation.html";
      } else {
        alert("Please fix the following errors:\n" + errorMessage);
      }
    });
  }

  // Clear error styling on input
  [fullnameInput, emailInput, passwordInput].forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("error-border");
    });
  });
});

// Sign in redirect
document.addEventListener("DOMContentLoaded", function () {
  const signIn = document.getElementById("sign-in");
  if (signIn) {
    signIn.addEventListener("click", function () {
      window.location.href = "../../auth/login/login.html";
    });
  }
});
