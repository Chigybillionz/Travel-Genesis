/**
 * TRAVELGENESIS - FORGOT PASSWORD CONTROLLER
 * 2-Step OTP Verification & Password Reset Flow
 */

let currentEmail = "";
let countdownTimer = null;
let resendSeconds = 45;

// Toast Notification Utility
function showToast(message, type = "error") {
  const existing = document.querySelector(".toast-msg");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast-msg ${type}`;
  toast.innerHTML = `
    <span>${message.replace(/\n/g, "<br>")}</span>
    <button type="button" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;padding:0;line-height:1;">&times;</button>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  toast.querySelector("button").onclick = () => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  };

  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }
  }, 4500);
}

// Resend Countdown Timer
function startResendCountdown() {
  const resendBtn = document.getElementById("resendOtpBtn");
  const countdownSpan = document.getElementById("resendCountdown");
  if (!resendBtn || !countdownSpan) return;

  clearInterval(countdownTimer);
  resendSeconds = 45;
  resendBtn.disabled = true;
  countdownSpan.textContent = resendSeconds;

  countdownTimer = setInterval(() => {
    resendSeconds -= 1;
    if (resendSeconds <= 0) {
      clearInterval(countdownTimer);
      resendBtn.disabled = false;
      resendBtn.textContent = "Resend Code";
    } else {
      countdownSpan.textContent = resendSeconds;
    }
  }, 1000);
}

// Password Strength Meter
function updatePasswordMeter(pass) {
  const fill = document.getElementById("meterFill");
  const text = document.getElementById("meterText");
  if (!fill || !text) return;

  if (!pass) {
    fill.style.width = "0%";
    fill.style.backgroundColor = "#E2E8F0";
    text.textContent = "Must be at least 8 characters";
    text.style.color = "#64748B";
    return;
  }

  let strength = 0;
  if (pass.length >= 8) strength += 40;
  if (/[A-Z]/.test(pass)) strength += 20;
  if (/[0-9]/.test(pass)) strength += 20;
  if (/[^A-Za-z0-9]/.test(pass)) strength += 20;

  fill.style.width = `${strength}%`;

  if (pass.length < 8) {
    fill.style.backgroundColor = "#EF4444";
    text.textContent = `Too short (${pass.length}/8 characters)`;
    text.style.color = "#EF4444";
  } else if (strength < 60) {
    fill.style.backgroundColor = "#F59E0B";
    text.textContent = "Moderate password";
    text.style.color = "#D97706";
  } else {
    fill.style.backgroundColor = "#10B981";
    text.textContent = "Strong password ✓";
    text.style.color = "#059669";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");

  const requestForm = document.getElementById("requestOtpForm");
  const recoveryEmailInput = document.getElementById("recoveryEmail");
  const sendOtpBtn = document.getElementById("sendOtpBtn");

  const resetForm = document.getElementById("resetPasswordForm");
  const newPassInput = document.getElementById("newPassword");
  const confirmPassInput = document.getElementById("confirmPassword");
  const resetPassBtn = document.getElementById("resetPassBtn");

  const sentEmailDisplay = document.getElementById("sentEmailDisplay");
  const changeEmailBtn = document.getElementById("changeEmailBtn");
  const resendBtn = document.getElementById("resendOtpBtn");

  const devBanner = document.getElementById("devOtpBanner");
  const devCodeEl = document.getElementById("devOtpCode");
  const devAutofillBtn = document.getElementById("devAutofillBtn");

  const otpBoxes = Array.from(document.querySelectorAll(".otp-box"));

  // Check if email was pre-filled via query params (e.g. from login page)
  const urlParams = new URLSearchParams(window.location.search);
  const emailParam = urlParams.get("email");
  if (emailParam && recoveryEmailInput) {
    recoveryEmailInput.value = emailParam.trim();
  }

  // Eye Toggles
  function bindEyeToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener("click", () => {
      const isPass = input.getAttribute("type") === "password";
      input.setAttribute("type", isPass ? "text" : "password");
      btn.querySelector(".eye-closed").style.display = isPass ? "none" : "block";
      btn.querySelector(".eye-open").style.display = isPass ? "block" : "none";
    });
  }

  bindEyeToggle("eyeToggleNew", "newPassword");
  bindEyeToggle("eyeToggleConfirm", "confirmPassword");

  // Real-time password meter
  if (newPassInput) {
    newPassInput.addEventListener("input", (e) => {
      updatePasswordMeter(e.target.value);
    });
  }

  // ----------------------------------------------------
  // STEP 1: REQUEST VERIFICATION CODE
  // ----------------------------------------------------
  if (requestForm) {
    requestForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = recoveryEmailInput.value.trim();

      if (!email || !email.includes("@")) {
        showToast("Please enter a valid email address.");
        recoveryEmailInput.focus();
        return;
      }

      const origBtnHtml = sendOtpBtn.innerHTML;
      sendOtpBtn.disabled = true;
      sendOtpBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 0.8s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Sending Code...</span>
      `;

      try {
        let res;
        if (window.API && window.API.auth && typeof API.auth.forgotPassword === "function") {
          res = await API.auth.forgotPassword({ email });
        } else {
          // Fallback simulation
          await new Promise((r) => setTimeout(r, 600));
          res = {
            success: true,
            email,
            otp: String(Math.floor(100000 + Math.random() * 900000))
          };
        }

        currentEmail = email;
        if (sentEmailDisplay) sentEmailDisplay.textContent = email;

        // Show dev OTP hint if available
        if (res && res.otp) {
          if (devBanner && devCodeEl) {
            devCodeEl.textContent = res.otp;
            devBanner.style.display = "flex";
          }
        }

        // Transition to Step 2
        step1.style.display = "none";
        step2.style.display = "block";

        // Reset OTP boxes
        otpBoxes.forEach((b) => {
          b.value = "";
          b.classList.remove("filled", "error");
        });

        // Focus first OTP box
        if (otpBoxes[0]) otpBoxes[0].focus();

        startResendCountdown();
        showToast("Verification code sent! Please check your inbox.", "success");
      } catch (err) {
        console.error("Forgot password request error:", err);
        showToast(err.message || "Could not find an account with this email.");
      } finally {
        sendOtpBtn.disabled = false;
        sendOtpBtn.innerHTML = origBtnHtml;
      }
    });
  }

  // Change Email Button (Return to Step 1)
  if (changeEmailBtn) {
    changeEmailBtn.addEventListener("click", () => {
      step2.style.display = "none";
      step1.style.display = "block";
      if (recoveryEmailInput) recoveryEmailInput.focus();
    });
  }

  // ----------------------------------------------------
  // 6-DIGIT OTP BOXES INTERACTION
  // ----------------------------------------------------
  otpBoxes.forEach((box, idx) => {
    // Input handling
    box.addEventListener("input", (e) => {
      const val = e.target.value.replace(/\D/g, "");
      e.target.value = val ? val[0] : "";

      if (e.target.value) {
        box.classList.add("filled");
        box.classList.remove("error");
        // Auto-advance to next box
        if (idx < otpBoxes.length - 1) {
          otpBoxes[idx + 1].focus();
        } else if (newPassInput) {
          newPassInput.focus();
        }
      } else {
        box.classList.remove("filled");
      }
    });

    // Keydown: backspace navigation
    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && idx > 0) {
        otpBoxes[idx - 1].focus();
        otpBoxes[idx - 1].value = "";
        otpBoxes[idx - 1].classList.remove("filled");
      }
    });

    // Paste handling: supports pasting entire 6 digits
    box.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData)
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

      if (!pasteData) return;

      pasteData.split("").forEach((char, i) => {
        if (otpBoxes[i]) {
          otpBoxes[i].value = char;
          otpBoxes[i].classList.add("filled");
          otpBoxes[i].classList.remove("error");
        }
      });

      if (pasteData.length === 6 && newPassInput) {
        newPassInput.focus();
      } else if (otpBoxes[pasteData.length]) {
        otpBoxes[pasteData.length].focus();
      }
    });
  });

  // Dev Autofill Button
  if (devAutofillBtn) {
    devAutofillBtn.addEventListener("click", () => {
      const code = devCodeEl ? devCodeEl.textContent.trim() : "";
      if (!code) return;
      code.split("").forEach((char, i) => {
        if (otpBoxes[i]) {
          otpBoxes[i].value = char;
          otpBoxes[i].classList.add("filled");
        }
      });
      if (newPassInput) newPassInput.focus();
    });
  }

  // Resend OTP Action
  if (resendBtn) {
    resendBtn.addEventListener("click", async () => {
      if (!currentEmail || resendBtn.disabled) return;

      resendBtn.disabled = true;
      try {
        let res;
        if (window.API && window.API.auth && typeof API.auth.forgotPassword === "function") {
          res = await API.auth.forgotPassword({ email: currentEmail });
        }
        if (res && res.otp && devCodeEl) {
          devCodeEl.textContent = res.otp;
        }
        startResendCountdown();
        showToast("A new verification code has been sent.", "success");
      } catch (err) {
        showToast(err.message || "Failed to resend code.");
        resendBtn.disabled = false;
      }
    });
  }

  // ----------------------------------------------------
  // STEP 2: VERIFY OTP & RESET PASSWORD
  // ----------------------------------------------------
  if (resetForm) {
    resetForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const otp = otpBoxes.map((b) => b.value).join("");
      const newPassword = newPassInput.value;
      const confirmPassword = confirmPassInput.value;

      // Validation
      if (otp.length < 6) {
        showToast("Please enter all 6 digits of the verification code.");
        const emptyBox = otpBoxes.find((b) => !b.value) || otpBoxes[0];
        emptyBox.focus();
        otpBoxes.forEach((b) => { if (!b.value) b.classList.add("error"); });
        return;
      }

      if (!newPassword || newPassword.length < 8) {
        showToast("New password must be at least 8 characters long.");
        newPassInput.focus();
        return;
      }

      if (newPassword !== confirmPassword) {
        showToast("Passwords do not match. Please re-enter.");
        confirmPassInput.focus();
        return;
      }

      const origBtnHtml = resetPassBtn.innerHTML;
      resetPassBtn.disabled = true;
      resetPassBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 0.8s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Resetting Password...</span>
      `;

      try {
        if (window.API && window.API.auth && typeof API.auth.resetPassword === "function") {
          await API.auth.resetPassword({
            email: currentEmail,
            otp,
            newPassword
          });
        } else {
          // Fallback simulation
          await new Promise((r) => setTimeout(r, 600));
        }

        // Transition to Step 3: Success Screen
        step2.style.display = "none";
        step3.style.display = "flex";

        showToast("Password reset successful!", "success");
      } catch (err) {
        console.error("Password reset error:", err);
        showToast(err.message || "Invalid or expired code. Please try again.");
        otpBoxes.forEach((b) => b.classList.add("error"));
      } finally {
        resetPassBtn.disabled = false;
        resetPassBtn.innerHTML = origBtnHtml;
      }
    });
  }
});
