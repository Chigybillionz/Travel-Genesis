// SHARED NAVIGATION COMPONENT FOR BEZAO TRAVEL APP

function getNavInitials(name) {
  if (!name) return "TG";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ? parts[0][0] : "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return ((first + last).toUpperCase()) || "TG";
}

// Function to create the shared navigation HTML
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
              <a href="../../booking/home/home.html" data-page="home">Home</a>
              <a href="../../trips/trip-list/trip.html" data-page="trip">My Trip</a>
              <a href="../../user/explore/explore.html" data-page="explore">Explore</a>
              <a href="../../user/profile/profile.html" data-page="profile">Profile</a>
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
        if (curPath.includes("profile.html")) return;
        navigateToAppPage("user/profile/profile.html");
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

// Set the active navigation link based on current page
function setActiveNavLink() {
  const currentPath = window.location.pathname.toLowerCase();
  
  // 1. Update Desktop Header Nav
  const navLinks = document.querySelectorAll(".integrated-nav a");
  navLinks.forEach((link) => {
    link.classList.remove("active");
    const page = link.getAttribute("data-page");
    if (page && currentPath.includes(page)) {
      link.classList.add("active");
    }
  });

  // 2. Update Mobile Bottom Nav
  const bottomNavLinks = document.querySelectorAll(".bottom-nav .nav-item");
  bottomNavLinks.forEach((link) => {
    link.classList.remove("active");
    const text = (link.textContent || "").trim().toLowerCase();
    
    if (currentPath.includes("home") && text.includes("home")) {
      link.classList.add("active");
    } else if (currentPath.includes("trip") && text.includes("trip")) {
      link.classList.add("active");
    } else if (currentPath.includes("explore") && text.includes("explore")) {
      link.classList.add("active");
    } else if (currentPath.includes("profile") && text.includes("profile")) {
      link.classList.add("active");
    }
  });
}

function navigateToAppPage(targetSubpath) {
  const curPath = window.location.pathname.toLowerCase();
  const pagesIndex = curPath.indexOf("/pages/");
  if (pagesIndex !== -1) {
    const basePath = window.location.pathname.substring(0, pagesIndex + 7);
    window.location.href = basePath + targetSubpath;
  } else {
    window.location.href = "pages/" + targetSubpath;
  }
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
      navigateToAppPage("user/notifications/notification.html");
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      navigateToAppPage("booking/search/search.html");
    });
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
