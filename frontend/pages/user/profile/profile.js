/**
 * Profile page
 * - Renders identity from cache first (no flicker), then syncs with /api/users/profile
 * - Computes live travel stats from /api/bookings/my-trips (amounts in Naira)
 * - Shows unread notification count from /api/notifications
 * - Full support for live avatar upload, preview, resizing, database persistence & global synchronization
 */

const formatNaira = (amount) => `₦${Number(amount || 0).toLocaleString("en-NG")}`;

function getInitials(name) {
  if (!name) return "TG";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ? parts[0][0] : "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return ((first + last).toUpperCase()) || "TG";
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Client-side image compression and resizing using HTML5 Canvas
function compressAndResizeImage(file, maxWidth = 320, maxHeight = 320, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function renderIdentity(user) {
  const name = user.name || "Guest Traveler";
  const email = user.email || "Sign in to view your account";
  const avatarUrl = user.avatarUrl || localStorage.getItem("userAvatar") || "";

  document.querySelectorAll(".profile-name").forEach((el) => (el.textContent = name));
  document.querySelectorAll(".profile-email").forEach((el) => (el.textContent = email));

  const avatar = document.getElementById("profile-avatar");
  if (avatar) {
    if (avatarUrl && avatarUrl.trim()) {
      avatar.innerHTML = `<img src="${avatarUrl}" alt="${escapeHtml(name)}" class="profile-avatar-img" />`;
    } else {
      avatar.textContent = getInitials(user.name);
    }
  }

  const detailName = document.getElementById("detail-name");
  const detailEmail = document.getElementById("detail-email");
  if (detailName) detailName.textContent = user.name || "—";
  if (detailEmail) detailEmail.textContent = user.email || "—";

  const memberSince = document.getElementById("member-since");
  if (memberSince && user.createdAt) {
    const date = new Date(user.createdAt);
    if (!isNaN(date)) {
      memberSince.textContent = `Member since ${date.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`;
    }
  }
}

// Load user data when page loads
async function loadUserProfile() {
  const cachedName = localStorage.getItem("userFullName") || localStorage.getItem("userName");
  const cachedEmail = localStorage.getItem("userEmail");
  const cachedAvatar = localStorage.getItem("userAvatar");
  const cachedUser = window.API && API.getUser ? API.getUser() : null;

  renderIdentity({
    name: (cachedUser && cachedUser.name) || cachedName,
    email: (cachedUser && cachedUser.email) || cachedEmail,
    avatarUrl: (cachedUser && cachedUser.avatarUrl) || cachedAvatar,
    createdAt: cachedUser && cachedUser.createdAt,
  });

  if (window.API && API.isAuthenticated()) {
    try {
      const response = await API.users.getProfile();
      if (response && response.user) renderIdentity(response.user);
    } catch (err) {
      console.warn("Could not sync profile from server:", err.message);
    }
  }
}

async function loadTravelStats() {
  if (!(window.API && API.isAuthenticated())) return;

  try {
    const response = await API.bookings.getMyTrips();
    const bookings = response && Array.isArray(response.data) ? response.data : [];

    const active = bookings.filter((b) => b.status !== "Cancelled");
    const now = Date.now();

    const upcoming = active.filter((b) => {
      const dep = b.flightId && b.flightId.departureTime;
      return dep ? new Date(dep).getTime() > now : true;
    });

    const totalSpent = active.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

    const destinations = new Set(
      active
        .map((b) => b.flightId && b.flightId.destination && b.flightId.destination.city)
        .filter(Boolean)
    );

    setText("stat-trips", bookings.length);
    setText("stat-upcoming", upcoming.length);
    setText("stat-spent", formatNaira(totalSpent));
    setText("stat-destinations", destinations.size);

    renderRecentTrips(bookings.slice(0, 3));
  } catch (err) {
    console.warn("Could not load travel stats:", err.message);
  }
}

function renderRecentTrips(bookings) {
  const container = document.getElementById("recent-trips");
  if (!container || bookings.length === 0) return;

  container.innerHTML = bookings
    .map((b) => {
      const flight = b.flightId || {};
      const origin = (flight.origin && flight.origin.code) || "LOS";
      const destCode = (flight.destination && flight.destination.code) || "";
      const destCity = (flight.destination && flight.destination.city) || "Destination";
      const date = flight.departureTime
        ? new Date(flight.departureTime).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
        : "Date TBC";
      const status = (b.status || "Confirmed").toLowerCase();

      return `
        <a href="../../trips/trip-list/trip.html" class="trip-row">
          <span class="menu-icon teal"><i class="fa-solid fa-plane"></i></span>
          <span class="trip-route">
            <strong>${escapeHtml(origin)} → ${escapeHtml(destCode || destCity)} · ${escapeHtml(destCity)}</strong>
            <small>${escapeHtml(flight.airline || "Travel Genesis")} · ${escapeHtml(date)}</small>
          </span>
          <span class="trip-side">
            <span class="trip-price">${formatNaira(b.totalPrice)}</span>
            <span class="status-pill ${escapeHtml(status)}">${escapeHtml(b.status || "Confirmed")}</span>
          </span>
        </a>`;
    })
    .join("");
}

async function loadUnreadCount() {
  if (!(window.API && API.isAuthenticated())) return;
  try {
    const res = await API.notifications.getAll();
    const items = res && Array.isArray(res.data) ? res.data : [];
    const unread = items.filter((n) => !n.isRead).length;
    const badge = document.getElementById("notif-badge");
    if (badge && unread > 0) {
      badge.textContent = unread > 99 ? "99+" : unread;
      badge.hidden = false;
    }
  } catch (err) {
    console.warn("Could not load notifications count:", err.message);
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

document.addEventListener("DOMContentLoaded", function () {
  loadUserProfile();
  loadTravelStats();
  loadUnreadCount();

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "../../user/logout/logout.html";
    });
  }

  // Delete account
  const deleteBtn = document.getElementById("deleteAccountBtn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "../../user/delete-account/delete.html";
    });
  }

  // Already on profile: ignore taps on the active nav item
  const profileNavItem = document.getElementById("profileNavItem");
  if (profileNavItem) {
    profileNavItem.addEventListener("click", function (e) {
      e.preventDefault();
    });
  }

  // ===================== EDIT PROFILE MODAL =====================
  const modal = document.getElementById("edit-profile-modal");
  const openBtn = document.getElementById("edit-profile-btn");
  const closeBtn = document.getElementById("modal-close-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn");
  const form = document.getElementById("edit-profile-form");
  const nameInput = document.getElementById("edit-name");
  const emailInput = document.getElementById("edit-email");
  const currentPassInput = document.getElementById("edit-current-pass");
  const newPassInput = document.getElementById("edit-new-pass");
  const modalAvatarContainer = document.getElementById("modal-avatar-container");
  const modalAvatarPreview = document.getElementById("modal-avatar-preview");
  const avatarFileInput = document.getElementById("avatar-file-input");
  const avatarBtnRemove = document.getElementById("avatar-btn-remove");
  const modalAvatarHint = document.getElementById("modal-avatar-hint");
  const saveBtn = document.getElementById("modal-save-btn");
  const saveBtnText = saveBtn && saveBtn.querySelector(".btn-save-text");
  const saveBtnSpinner = saveBtn && saveBtn.querySelector(".btn-save-spinner");
  const toast = document.getElementById("modal-toast");
  const nameError = document.getElementById("edit-name-error");
  const passError = document.getElementById("edit-pass-error");

  let pendingAvatarUrl = "";

  function renderModalAvatarPreview() {
    if (!modalAvatarPreview) return;
    if (pendingAvatarUrl && pendingAvatarUrl.trim()) {
      modalAvatarPreview.innerHTML = `<img src="${pendingAvatarUrl}" alt="Avatar Preview" />`;
      if (avatarBtnRemove) avatarBtnRemove.style.display = "inline-flex";
      if (modalAvatarHint) modalAvatarHint.textContent = "Click on the photo or button to change it";
    } else {
      const name = nameInput ? nameInput.value.trim() : "";
      modalAvatarPreview.textContent = getInitials(name);
      if (avatarBtnRemove) avatarBtnRemove.style.display = "none";
      if (modalAvatarHint) modalAvatarHint.textContent = "JPG, PNG or WebP (max 5MB)";
    }
  }

  function openModal() {
    if (!modal) return;
    // Pre-fill current values
    const currentName = document.getElementById("profile-name-display")
      ? document.getElementById("profile-name-display").textContent.trim()
      : "";
    const currentEmail = document.getElementById("profile-email-display")
      ? document.getElementById("profile-email-display").textContent.trim()
      : "";
    if (nameInput) nameInput.value = currentName === "Guest Traveler" ? "" : currentName;
    if (emailInput) emailInput.value = currentEmail === "Sign in to view your account" ? "" : currentEmail;
    if (currentPassInput) currentPassInput.value = "";
    if (newPassInput) newPassInput.value = "";
    if (nameError) nameError.textContent = "";
    if (passError) passError.textContent = "";
    if (avatarFileInput) avatarFileInput.value = "";
    hideToast();

    // Pull current avatar
    const cachedUser = window.API && API.getUser ? API.getUser() : null;
    pendingAvatarUrl = (cachedUser && cachedUser.avatarUrl) || localStorage.getItem("userAvatar") || "";
    renderModalAvatarPreview();

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    if (nameInput) nameInput.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Handle avatar file selection
  if (avatarFileInput) {
    avatarFileInput.addEventListener("change", async function () {
      const file = this.files && this.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        showToast("Please choose an image file (JPG, PNG, or WebP).", "error");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast("Image must be smaller than 5MB.", "error");
        return;
      }

      try {
        const compressed = await compressAndResizeImage(file, 320, 320, 0.85);
        pendingAvatarUrl = compressed;
        renderModalAvatarPreview();
        showToast("Photo selected! Click Save Changes to apply.", "success");
      } catch (err) {
        console.error("Error reading image:", err);
        showToast("Could not process image file.", "error");
      }
    });
  }

  // Avatar container click triggers file upload
  if (modalAvatarContainer && avatarFileInput) {
    modalAvatarContainer.addEventListener("click", function (e) {
      if (e.target.closest("label")) return; // Avoid double triggering if badge clicked
      avatarFileInput.click();
    });
  }

  // Remove photo button
  if (avatarBtnRemove) {
    avatarBtnRemove.addEventListener("click", function (e) {
      e.stopPropagation();
      pendingAvatarUrl = "";
      if (avatarFileInput) avatarFileInput.value = "";
      renderModalAvatarPreview();
      showToast("Photo removed. Initials will be used.", "info");
    });
  }

  // Live avatar preview when typing name (if no photo uploaded)
  if (nameInput) {
    nameInput.addEventListener("input", function () {
      if (!pendingAvatarUrl) {
        renderModalAvatarPreview();
      }
    });
  }

  function showToast(msg, type) {
    if (!toast) return;
    toast.textContent = msg;
    toast.className = "modal-toast " + type;
    toast.hidden = false;
    if (type === "success" || type === "info") {
      setTimeout(hideToast, 3500);
    }
  }

  function hideToast() {
    if (!toast) return;
    toast.hidden = true;
    toast.className = "modal-toast";
  }

  function setSaving(saving) {
    if (!saveBtn) return;
    saveBtn.disabled = saving;
    if (saveBtnText) saveBtnText.hidden = saving;
    if (saveBtnSpinner) saveBtnSpinner.hidden = !saving;
  }

  // Open / close
  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  // Close on overlay click
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
  }

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) {
      closeModal();
    }
  });

  // Toggle password visibility
  document.querySelectorAll(".pass-toggle").forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (!input) return;
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      const icon = btn.querySelector("i");
      if (icon) {
        icon.className = isPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
      }
    });
  });

  // Form submit
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (nameError) nameError.textContent = "";
      if (passError) passError.textContent = "";
      hideToast();

      const newName = nameInput ? nameInput.value.trim() : "";
      const currentPass = currentPassInput ? currentPassInput.value : "";
      const newPass = newPassInput ? newPassInput.value : "";

      // Validation
      if (!newName) {
        if (nameError) nameError.textContent = "Name is required.";
        nameInput && nameInput.focus();
        return;
      }

      if (newPass && !currentPass) {
        if (passError) passError.textContent = "Please enter your current password to set a new one.";
        currentPassInput && currentPassInput.focus();
        return;
      }

      if (newPass && newPass.length < 8) {
        if (passError) passError.textContent = "New password must be at least 8 characters.";
        newPassInput && newPassInput.focus();
        return;
      }

      setSaving(true);

      try {
        const payload = { 
          name: newName,
          avatarUrl: pendingAvatarUrl 
        };
        if (newPass && currentPass) {
          payload.currentPassword = currentPass;
          payload.newPassword = newPass;
        }

        // Call backend update if authenticated
        if (window.API && API.users && typeof API.users.updateProfile === "function" && API.isAuthenticated()) {
          const res = await API.users.updateProfile(payload);
          if (res && res.user) {
            API.setUser(res.user);
          }
        }

        // Update local storage
        localStorage.setItem("userFullName", newName);
        localStorage.setItem("userName", newName);
        if (pendingAvatarUrl) {
          localStorage.setItem("userAvatar", pendingAvatarUrl);
        } else {
          localStorage.removeItem("userAvatar");
        }

        // Update UI immediately on profile page
        renderIdentity({ 
          name: newName, 
          email: emailInput ? emailInput.value : "",
          avatarUrl: pendingAvatarUrl 
        });

        // Broadcast to navbar and across the app
        window.dispatchEvent(new CustomEvent("tg:user-updated", { 
          detail: { name: newName, avatarUrl: pendingAvatarUrl } 
        }));

        showToast("Profile updated successfully!", "success");

        // Clear password fields
        if (currentPassInput) currentPassInput.value = "";
        if (newPassInput) newPassInput.value = "";

        // Auto-close after 1.5s
        setTimeout(closeModal, 1500);
      } catch (err) {
        const msg = (err && err.message) || "Failed to save. Please try again.";
        showToast(msg, "error");
      } finally {
        setSaving(false);
      }
    });
  }
});
