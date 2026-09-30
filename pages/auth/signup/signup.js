function showError(msg) {
  const existing = document.getElementById('custom-error-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'custom-error-toast';
  toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#f44336;color:white;padding:12px 24px;border-radius:8px;font-family:sans-serif;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:9999;display:flex;align-items:center;gap:12px;opacity:0;transition:opacity 0.3s;';
  toast.innerHTML = `<span>${msg.replace(/\n/g, '<br>')}</span><button style="background:none;border:none;color:white;font-weight:bold;cursor:pointer;padding:0;font-size:16px;">&times;</button>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.style.opacity = '1');
  toast.querySelector('button').onclick = () => {
    toast.style.opacity = '0';
    setTimeout(() => { if(document.body.contains(toast)) toast.remove(); }, 300);
  };
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.style.opacity = '0';
      setTimeout(() => { if(document.body.contains(toast)) toast.remove(); }, 300);
    }
  }, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#signupForm");
  const termsCheckbox = document.querySelector("#terms");
  const signupBtn = document.querySelector("#submitBtn");
  const passwordInput = document.querySelector("#password");
  const eyeToggle = document.querySelector("#eyeToggle");
  const fullnameInput = document.querySelector("#fullname");
  const emailInput = document.querySelector("#email");

  // Password visibility toggle (SVG-based)
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
        showError("Please fix the following errors:\n" + errorMessage);
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
