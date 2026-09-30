// SHARED NAVIGATION COMPONENT FOR BEZAO TRAVEL APP

// Function to create the shared navigation HTML
function createSharedNavigation() {
  return `
        <!-- Unified Integrated Header -->
        <header class="integrated-header">
          <div class="header-left">
            <div class="user-info">
              <div class="user-avatar">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <rect width="40" height="40" rx="19" fill="#E0B8FF"/>
                  <rect width="40" height="40" rx="19" fill="url(#pattern0_290_601)"/>
                  <defs>
                    <pattern id="pattern0_290_601" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_290_601" transform="translate(-0.00251256) scale(0.00502513)"/>
                    </pattern>
                    <image id="image0_290_601" width="200" height="199" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
                  </defs>
                </svg>
              </div>
              <div class="user-details">
                <div class="greeting">Hi, Solo</div>
                <div class="location">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.99994 6.71497C6.86151 6.71497 7.55994 6.01654 7.55994 5.15497C7.55994 4.29341 6.86151 3.59497 5.99994 3.59497C5.13838 3.59497 4.43994 4.29341 4.43994 5.15497C4.43994 6.01654 5.13838 6.71497 5.99994 6.71497Z" stroke="#6b7280" stroke-width="1.5" />
                    <path d="M1.8101 4.245C2.7951 -0.0849988 9.2101 -0.0799987 10.1901 4.25C10.7651 6.79 9.1851 8.94 7.8001 10.27C6.7951 11.24 5.2051 11.24 4.1951 10.27C2.8151 8.94 1.2351 6.785 1.8101 4.245Z" stroke="#6b7280" stroke-width="1.5" />
                  </svg>
                  Lagos, Nigeria
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
              <button class="icon-btn" id="notification-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.0201 2.91003C8.71009 2.91003 6.02009 5.60003 6.02009 8.91003V11.8C6.02009 12.41 5.76009 13.34 5.45009 13.86L4.30009 15.77C3.59009 16.95 4.08009 18.26 5.38009 18.7C9.69009 20.14 14.3401 20.14 18.6501 18.7C19.8601 18.3 20.3901 16.87 19.7301 15.77L18.5801 13.86C18.2801 13.34 18.0201 12.41 18.0201 11.8V8.91003C18.0201 5.61003 15.3201 2.91003 12.0201 2.91003Z" stroke="#374151" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
                  <path d="M13.8699 3.19994C13.5599 3.10994 13.2399 3.03994 12.9099 2.99994C11.9499 2.87994 11.0299 2.94994 10.1699 3.19994C10.4599 2.45994 11.1799 1.93994 12.0199 1.93994C12.8599 1.93994 13.5799 2.45994 13.8699 3.19994Z" stroke="#374151" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" stroke="#374151" stroke-width="1.5" stroke-miterlimit="10" />
                </svg>
              </button>
              <button class="icon-btn" id="search-btn">
                <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.49928 1.91687e-08C7.14387 0.000115492 5.80814 0.324364 4.60353 0.945694C3.39893 1.56702 2.36037 2.46742 1.57451 3.57175C0.788656 4.67609 0.278287 5.95235 0.0859852 7.29404C-0.106316 8.63574 0.0250263 10.004 0.469055 11.2846C0.913084 12.5652 1.65692 13.7211 2.63851 14.6557C3.6201 15.5904 4.81098 16.2768 6.11179 16.6576C7.4126 17.0384 8.78562 17.1026 10.1163 16.8449C11.447 16.5872 12.6967 16.015 13.7613 15.176L17.4133 18.828C17.6019 19.0102 17.8545 19.111 18.1167 19.1087C18.3789 19.1064 18.6297 19.0012 18.8151 18.8158C19.0005 18.6304 19.1057 18.3796 19.108 18.1174C19.1102 17.8552 19.0094 17.6026 18.8273 17.414L15.1753 13.762C16.1633 12.5086 16.7784 11.0024 16.9504 9.41573C17.1223 7.82905 16.8441 6.22602 16.1475 4.79009C15.4509 3.35417 14.3642 2.14336 13.0116 1.29623C11.659 0.449106 10.0952 -0.000107143 8.49928 1.91687e-08ZM1.99928 8.5C1.99928 6.77609 2.6841 5.12279 3.90308 3.90381C5.12207 2.68482 6.77537 2 8.49928 2C10.2232 2 11.8765 2.68482 13.0955 3.90381C14.3145 5.12279 14.9993 6.77609 14.9993 8.5C14.9993 10.2239 14.3145 11.8772 13.0955 13.0962C11.8765 14.3152 10.2232 15 8.49928 15C6.77537 15 5.12207 14.3152 3.90308 13.0962C2.6841 11.8772 1.99928 10.2239 1.99928 8.5Z" fill="#374151" />
                </svg>
              </button>
            </div>
          </div>
        </header>
    `;
}

// Initialize navigation on page load
function initializeSharedNavigation() {
  // Check if we're on desktop (768px or larger)
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  if (!isDesktop) {
    return; // Don't modify mobile view
  }

  // Find the container where navigation should go
  const navContainer = document.getElementById("shared-nav-container");

  if (navContainer) {
    navContainer.innerHTML = createSharedNavigation();

    // Set active state based on current page
    setActiveNavLink();

    // Add click handlers
    addNavigationHandlers();
  }
}

// Set the active navigation link based on current page
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".integrated-nav a");

  navLinks.forEach((link) => {
    link.classList.remove("active");

    const page = link.getAttribute("data-page");

    // Check if current URL contains the page identifier
    if (currentPath.toLowerCase().includes(page)) {
      link.classList.add("active");
    }
  });
}

// Add click handlers for navigation
function addNavigationHandlers() {
  // Desktop navigation links
  const navLinks = document.querySelectorAll(".integrated-nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active from all
      navLinks.forEach((l) => l.classList.remove("active"));

      // Add active to clicked
      this.classList.add("active");

      // Navigate
      const href = this.getAttribute("href");
      window.location.href = href;
    });
  });

  // Header icon handlers
  const notificationBtn = document.getElementById("notification-btn");
  const searchBtn = document.getElementById("search-btn");

  if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
      window.location.href = "../../user/notifications/notification.html";
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      window.location.href = "../../booking/search/search.html";
    });
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initializeSharedNavigation);

// Re-initialize on window resize (desktop/mobile switch)
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const wasDesktop = document.querySelector(".integrated-nav") !== null;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    if (wasDesktop !== isDesktop) {
      initializeSharedNavigation();
    }
  }, 250);
});
