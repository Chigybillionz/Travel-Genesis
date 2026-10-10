// SHARED NAVIGATION COMPONENT FOR BEZAO TRAVEL APP

function getNavInitials(name) {
  if (!name) return "TG";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ? parts[0][0] : "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return ((first + last).toUpperCase()) || "TG";
}

// Function to create the shared navigation HTML with clean semantic routes
function createSharedNavigation() {
  return `
        <!-- Unified Integrated Header -->
        <header class="integrated-header">
          <div class="header-left">
            <div class="user-info" id="nav-user-info" title="Go to Profile">
              <div class="user-avatar" id="nav-user-avatar">
                <div class="nav-avatar-initials">TG</div>
              </div>
              <div class="user-details">
                <div class="greeting" id="nav-user-greeting">Hi, Traveler</div>
                <div class="location">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.99994 6.71497C6.86151 6.71497 7.55994 6.01654 7.55994 5.15497C7.55994 4.29341 6.86151 3.59497 5.99994 3.59497C5.13838 3.59497 4.43994 4.29341 4.43994 5.15497C4.43994 6.01654 5.13838 6.71497 5.99994 6.71497Z" stroke="#6b7280" stroke-width="1.5" />
                    <path d="M1.8101 4.245C2.7951 -0.0849988 9.2101 -0.0799987 10.1901 4.25C10.7651 6.79 9.1851 8.94 7.8001 10.27C6.7951 11.24 5.2051 11.24 4.1951 10.27C2.8151 8.94 1.2351 6.785 1.8101 4.245Z" stroke="#6b7280" stroke-width="1.5" />
                  </svg>
                  <span class="nav-user-location" id="nav-user-location">Lagos, Nigeria</span>
                </div>
              </div>
            </div>
          </div>

          <div class="header-center">
            <nav class="integrated-nav">
              <a href="/home" data-page="home">Home</a>
              <a href="/trips" data-page="trip">My Trip</a>
              <a href="/explore" data-page="explore">Explore</a>
              <a href="/profile" data-page="profile">Profile</a>
            </nav>
          </div>

          <div class="header-right">
            <div class="header-icons">
              <button class="icon-btn" id="notification-btn" title="Notifications">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.0201 2.91003C8.71009 2.91003 6.02009 5.60003 6.02009 8.91003V11.8C6.02009 12.41 5.76009 13.34 5.45009 13.86L4.30009 15.77C3.59009 16.95 4.08009 18.26 5.38009 18.7C9.69009 20.14 14.3401 20.14 18.6501 18.7C19.8601 18.3 20.3901 16.87 19.7301 15.77L18.5801 13.86C18.2801 13.34 18.0201 12.41 18.0201 11.8V8.91003C18.0201 5.61003 15.3201 2.91003 12.0201 2.91003Z" stroke="#374151" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
                  <path d="M13.8699 3.19994C13.5599 3.10994 13.2399 3.03994 12.9099 2.99994C11.9499 2.87994 11.0299 2.94994 10.1699 3.19994C10.4599 2.45994 11.1799 1.93994 12.0199 1.93994C12.8599 1.93994 13.5799 2.45994 13.8699 3.19994Z" stroke="#374151" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" stroke="#374151" stroke-width="1.5" stroke-miterlimit="10" />
                </svg>
                <span class="notif-badge-dot" id="nav-notif-dot" style="display: none;"></span>
              </button>
              <button class="icon-btn" id="search-btn" title="Search Flights">
                <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.49928 1.91687e-08C7.14387 0.000115492 5.80814 0.324364 4.60353 0.945694C3.39893 1.56702 2.36037 2.46742 1.57451 3.57175C0.788656 4.67609 0.278287 5.95235 0.0859852 7.29404C-0.106316 8.63574 0.0250263 10.004 0.469055 11.2846C0.913084 12.5652 1.65692 13.7211 2.63851 14.6557C3.6201 15.5904 4.81098 16.2768 6.11179 16.6576C7.4126 17.0384 8.78562 17.1026 10.1163 16.8449C11.447 16.5872 12.6967 16.015 13.7613 15.176L17.4133 18.828C17.6019 19.0102 17.8545 19.111 18.1167 19.1087C18.3789 19.1064 18.6297 19.0012 18.8151 18.8158C19.0005 18.6304 19.1057 18.3796 19.108 18.1174C19.1102 17.8552 19.0094 17.6026 18.8273 17.414L15.1753 13.762C16.1633 12.5086 16.7784 11.0024 16.9504 9.41573C17.1223 7.82905 16.8441 6.22602 16.1475 4.79009C15.4509 3.35417 14.3642 2.14336 13.0116 1.29623C11.659 0.449106 10.0952 -0.000107143 8.49928 1.91687e-08ZM1.99928 8.5C1.99928 6.77609 2.6841 5.12279 3.90308 3.90381C5.12207 2.68482 6.77537 2 8.49928 2C10.2232 2 11.8765 2.68482 13.0955 3.90381C14.3145 5.12279 14.9993 6.77609 14.9993 8.5C14.9993 10.2239 14.3145 11.8772 13.0955 13.0962C11.8765 14.3152 10.2232 15 8.49928 15C6.77537 15 5.12207 14.3152 3.90308 13.0962C2.6841 11.8772 1.99928 10.2239 1.99928 8.5Z" fill="#374151" />
                </svg>
              </button>
            </div>
          </div>
        </header>
    `;
}

// Function to update the user's name, avatar, and location in the shared nav
function updateSharedNavUser() {
  const navContainer = document.getElementById("shared-nav-container");
  if (!navContainer) return;

  const user = (window.API && API.getUser && API.getUser()) || null;
  const fullName = (user && user.name) || localStorage.getItem("userFullName") || localStorage.getItem("userName") || "";
  const firstName = fullName ? fullName.trim().split(/\s+/)[0] : "Traveler";
  const avatarUrl = (user && user.avatarUrl) || localStorage.getItem("userAvatar") || "";
  const location = (user && user.location) || localStorage.getItem("userLocation") || "Lagos, Nigeria";

  const greetingEl = document.getElementById("nav-user-greeting") || navContainer.querySelector(".greeting");
  if (greetingEl) {
    greetingEl.textContent = `Hi, ${firstName}`;
  }

  const locEl = document.getElementById("nav-user-location") || navContainer.querySelector(".nav-user-location");
  if (locEl) {
    locEl.textContent = location;
  }

  const avatarEl = document.getElementById("nav-user-avatar") || navContainer.querySelector(".user-avatar");
  if (avatarEl) {
    if (avatarUrl && avatarUrl.trim()) {
      avatarEl.innerHTML = `<img src="${avatarUrl}" alt="${firstName}" class="nav-avatar-img" />`;
    } else if (fullName) {
      const initials = getNavInitials(fullName);
      avatarEl.innerHTML = `<div class="nav-avatar-initials">${initials}</div>`;
    } else {
      avatarEl.innerHTML = `<div class="nav-avatar-initials">TG</div>`;
    }
  }
}

// Clean Route Helper
const APP_ROUTES = {
  "home": "/home",
  "trip": "/trips",
  "trips": "/trips",
  "explore": "/explore",
  "profile": "/profile",
  "search": "/search",
  "flight": "/flight-details",
  "flight-details": "/flight-details",
  "seat": "/seat-selection",
  "seat-selection": "/seat-selection",
  "booking-details": "/booking-details",
  "bookings": "/booking-details",
  "date-picker": "/date-picker",
  "datepicker": "/date-picker",
  "e-ticket": "/e-ticket",
  "checkout": "/payment",
  "payment": "/payment",
  "notifications": "/notifications",
  "notification": "/notifications",
  "settings": "/settings",
  "logout": "/logout",
  "delete": "/delete-account",
  "delete-account": "/delete-account",
  "login": "/login",
  "signup": "/signup",
  "splash": "/splash",
  "onboarding": "/onboarding",
  "onboarding-2": "/onboarding-2"
};

function navigateToAppPage(targetSubpath) {
  if (!targetSubpath) return;
  if (targetSubpath.startsWith("/")) {
    window.location.href = targetSubpath;
    return;
  }
  const clean = targetSubpath
    .replace(/^(\.\.\/)+/, '')
    .replace(/^pages\//, '')
    .replace(/\.html$/, '');
  const base = clean.split('/').pop().toLowerCase();
  if (APP_ROUTES[base]) {
    window.location.href = APP_ROUTES[base];
    return;
  }
  if (APP_ROUTES[clean.toLowerCase()]) {
    window.location.href = APP_ROUTES[clean.toLowerCase()];
    return;
  }
  window.location.href = "/" + clean;
}

// Set the active navigation link based on current page
function setActiveNavLink() {
  const currentPath = window.location.pathname.toLowerCase();

  // 1. Update Desktop Header Nav
  const navLinks = document.querySelectorAll(".integrated-nav a");
  navLinks.forEach((link) => {
    link.classList.remove("active");
    const page = link.getAttribute("data-page");
    if (
      (page === "home" && (currentPath === "/home" || currentPath === "/" || currentPath.includes("home"))) ||
      (page === "trip" && (currentPath === "/trips" || currentPath.includes("trip") || currentPath.includes("e-ticket"))) ||
      (page === "explore" && (currentPath === "/explore" || currentPath.includes("explore"))) ||
      (page === "profile" && (currentPath === "/profile" || currentPath.includes("profile") || currentPath.includes("settings")))
    ) {
      link.classList.add("active");
    }
  });

  // 2. Update Mobile Bottom Nav
  const bottomNavLinks = document.querySelectorAll(".bottom-nav .nav-item");
  bottomNavLinks.forEach((link) => {
    link.classList.remove("active");
    const text = (link.textContent || "").trim().toLowerCase();
    const href = (link.getAttribute("href") || "").toLowerCase();

    if (
      (text.includes("home") || href.includes("home")) &&
      (currentPath === "/home" || currentPath === "/" || currentPath.includes("home"))
    ) {
      link.classList.add("active");
    } else if (
      (text.includes("trip") || href.includes("trip")) &&
      (currentPath === "/trips" || currentPath.includes("trip") || currentPath.includes("e-ticket"))
    ) {
      link.classList.add("active");
    } else if (
      (text.includes("explore") || href.includes("explore")) &&
      (currentPath === "/explore" || currentPath.includes("explore"))
    ) {
      link.classList.add("active");
    } else if (
      (text.includes("profile") || href.includes("profile")) &&
      (currentPath === "/profile" || currentPath.includes("profile") || currentPath.includes("settings"))
    ) {
      link.classList.add("active");
    }
  });
}

// Add click handlers for navigation
function addNavigationHandlers() {
  const navLinks = document.querySelectorAll(".integrated-nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
      const href = this.getAttribute("href");
      window.location.href = href;
    });
  });

  // Header icon handlers
  const notificationBtn = document.getElementById("notification-btn");
  const searchBtn = document.getElementById("search-btn");

  if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
      window.location.href = "/notifications";
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      window.location.href = "/search";
    });
  }
}

// Initialize navigation on page load
function initializeSharedNavigation() {
  const navContainer = document.getElementById("shared-nav-container");

  if (navContainer) {
    navContainer.innerHTML = createSharedNavigation();

    // Update user info & avatar
    updateSharedNavUser();

    // Set active state based on current page
    setActiveNavLink();

    // Add click handlers
    addNavigationHandlers();

    // User info click opens profile
    const userInfoBtn = document.getElementById("nav-user-info");
    if (userInfoBtn) {
      userInfoBtn.addEventListener("click", () => {
        const curPath = window.location.pathname.toLowerCase();
        if (curPath === "/profile" || curPath.includes("profile")) return;
        window.location.href = "/profile";
      });
    }

    // Check auth and unread notifications if API is available
    if (window.API && API.isAuthenticated && API.isAuthenticated()) {
      API.notifications.getAll().then((res) => {
        if (res && res.unreadCount > 0) {
          const dot = document.getElementById("nav-notif-dot");
          if (dot) dot.style.display = "block";
        }
      }).catch(() => {});
    }
  }
}

// Global synchronization listeners
window.addEventListener("storage", (e) => {
  if (e.key === "userAvatar" || e.key === "userFullName" || e.key === "userName" || e.key === "tg_user") {
    updateSharedNavUser();
  }
});

window.addEventListener("tg:user-updated", () => {
  updateSharedNavUser();
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", initializeSharedNavigation);

// ==========================================================================
// DYNAMIC TOP CONFIRMATION ISLAND MODAL
// Drops down smoothly from the top of the viewport for confirmation actions
// ==========================================================================

function ensureTopConfirmIslandDOM() {
  let backdrop = document.getElementById("top-confirm-backdrop");
  let island = document.getElementById("top-confirm-island");

  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "top-confirm-backdrop";
    backdrop.className = "top-confirm-backdrop";
    document.body.appendChild(backdrop);
  }

  if (!island) {
    island = document.createElement("div");
    island.id = "top-confirm-island";
    island.className = "top-confirm-island";
    island.setAttribute("role", "dialog");
    island.setAttribute("aria-modal", "true");
    document.body.appendChild(island);
  }

  return { backdrop, island };
}

function showTopConfirmIsland(options = {}) {
  const {
    iconType = "danger", // 'danger' | 'warning' | 'primary'
    iconSvg = "",
    title = "Are you sure?",
    description = "Please confirm this action.",
    cancelText = "Cancel",
    confirmText = "Confirm",
    confirmBtnClass = "",
    onConfirm = null,
    onCancel = null
  } = options;

  const { backdrop, island } = ensureTopConfirmIslandDOM();

  let iconHtml = iconSvg;
  if (!iconHtml) {
    if (iconType === "danger") {
      // Sleek door/exit logout SVG
      iconHtml = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      `;
    } else if (iconType === "warning") {
      // Alert SVG
      iconHtml = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      `;
    } else {
      // Primary / info SVG
      iconHtml = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      `;
    }
  }

  island.innerHTML = `
    <div class="island-drag-notch"></div>
    <div class="island-main">
      <div class="island-icon-box ${iconType}">
        ${iconHtml}
      </div>
      <div class="island-text">
        <h3 class="island-title">${title}</h3>
        <p class="island-desc">${description}</p>
      </div>
    </div>
    <div class="island-actions">
      <button type="button" class="island-btn island-btn-cancel" id="top-confirm-cancel-btn">
        ${cancelText}
      </button>
      <button type="button" class="island-btn island-btn-confirm ${confirmBtnClass}" id="top-confirm-action-btn">
        <span>${confirmText}</span>
      </button>
    </div>
  `;

  function closeModal() {
    backdrop.classList.remove("show");
    island.classList.remove("show");
    document.removeEventListener("keydown", handleKeydown);
  }

  function handleKeydown(e) {
    if (e.key === "Escape") {
      closeModal();
      if (typeof onCancel === "function") onCancel();
    }
  }

  // Animate in via requestAnimationFrame
  requestAnimationFrame(() => {
    backdrop.classList.add("show");
    island.classList.add("show");
  });

  const cancelBtn = document.getElementById("top-confirm-cancel-btn");
  const confirmBtn = document.getElementById("top-confirm-action-btn");

  if (cancelBtn) {
    cancelBtn.onclick = (e) => {
      e.preventDefault();
      closeModal();
      if (typeof onCancel === "function") onCancel();
    };
  }

  backdrop.onclick = (e) => {
    if (e.target === backdrop) {
      closeModal();
      if (typeof onCancel === "function") onCancel();
    }
  };

  if (confirmBtn) {
    confirmBtn.onclick = async (e) => {
      e.preventDefault();
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = "0.8";
      confirmBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 0.8s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Processing...</span>
      `;
      if (typeof onConfirm === "function") {
        try {
          await onConfirm();
        } catch (err) {
          console.error("Top confirm error:", err);
          closeModal();
        }
      } else {
        closeModal();
      }
    };
  }

  document.addEventListener("keydown", handleKeydown);
}

function triggerTopLogout() {
  showTopConfirmIsland({
    iconType: "danger",
    title: "Sign out of Travel Genesis?",
    description: "You'll be returned to the sign-in screen. Your active bookings and trips will remain safely synced to your account.",
    cancelText: "Stay Logged In",
    confirmText: "Log Out",
    onConfirm: async () => {
      try {
        if (window.API && typeof API.logout === "function") {
          API.logout();
        } else {
          localStorage.clear();
        }
      } catch (err) {
        localStorage.clear();
      }
      setTimeout(() => {
        window.location.href = "/login";
      }, 250);
    }
  });
}

function triggerTopDeleteAccount() {
  showTopConfirmIsland({
    iconType: "danger",
    iconSvg: `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    `,
    title: "Delete Account Permanently?",
    description: "All your personal profile data, travel history, and e-tickets will be removed permanently. This action cannot be reversed.",
    cancelText: "Keep Account",
    confirmText: "Delete Account",
    onConfirm: async () => {
      try {
        if (window.API && typeof API.logout === "function") {
          API.logout();
        } else {
          localStorage.clear();
        }
      } catch (err) {
        localStorage.clear();
      }
      setTimeout(() => {
        window.location.href = "/splash";
      }, 300);
    }
  });
}

// Global click interception for Logout & Delete buttons across any screen
document.addEventListener("click", function (e) {
  const logoutTarget = e.target.closest('#logoutBtn, a[href="/logout"], a[href$="logout.html"], .trigger-logout');
  if (logoutTarget) {
    e.preventDefault();
    e.stopPropagation();
    triggerTopLogout();
    return;
  }

  const deleteTarget = e.target.closest('#deleteAccountBtn, a[href="/delete-account"], a[href$="delete.html"], .trigger-delete-account');
  if (deleteTarget) {
    e.preventDefault();
    e.stopPropagation();
    triggerTopDeleteAccount();
    return;
  }
});

// Expose utilities on window
window.showTopConfirmIsland = showTopConfirmIsland;
window.triggerTopLogout = triggerTopLogout;
window.triggerTopDeleteAccount = triggerTopDeleteAccount;
