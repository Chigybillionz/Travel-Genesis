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
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'Sign In';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <span>Signing In...</span>
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
              <path d="M12 2a10 10 0 0 1 10 10"></path>
            </svg>
          `;
        }

        (async () => {
          try {
            if (window.API && window.API.auth) {
              await window.API.auth.login({
                email: email.value.trim(),
                password: passwordInput.value,
              });
            } else {
              // Fallback
              localStorage.setItem("userEmail", email.value.trim());
            }

            // Redirect to home page upon successful authentication
            window.location.href = "../../booking/home/home.html";
          } catch (err) {
            console.error("Login error:", err);
            showError(err.message || "Invalid email or password. Please try again.");
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
            }
          }
        })();
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
