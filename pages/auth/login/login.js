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
        showError("Please fix the following errors:\n" + errorMessage);
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
