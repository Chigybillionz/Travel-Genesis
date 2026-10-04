// Load user data when page loads
document.addEventListener("DOMContentLoaded", function () {
  loadUserProfile();
});

// Function to load user profile data from API / localStorage
async function loadUserProfile() {
  const profileNameElement = document.querySelector(".profile-name");
  const profileEmailElement = document.querySelector(".profile-email");

  // Step 1: Render fast from local cache (zero flicker)
  const cachedName = localStorage.getItem("userFullName") || localStorage.getItem("userName");
  const cachedEmail = localStorage.getItem("userEmail");

  if (profileNameElement && cachedName) {
    profileNameElement.textContent = cachedName;
  }
  if (profileEmailElement && cachedEmail) {
    profileEmailElement.textContent = cachedEmail;
  }

  // Step 2: Fetch fresh profile from backend if user is authenticated
  if (window.API && window.API.isAuthenticated()) {
    try {
      const response = await window.API.users.getProfile();
      if (response && response.user) {
        const user = response.user;
        if (profileNameElement && user.name) {
          profileNameElement.textContent = user.name;
        }
        if (profileEmailElement && user.email) {
          profileEmailElement.textContent = user.email;
        }
      }
    } catch (err) {
      console.warn("Could not sync profile from server:", err.message);
    }
  } else if (!cachedName && !cachedEmail) {
    if (profileNameElement) profileNameElement.textContent = "Guest Traveler";
    if (profileEmailElement) profileEmailElement.textContent = "Sign in to view your account";
  }
}

// Menu item navigation handlers
document.addEventListener("DOMContentLoaded", function () {
  // Notifications menu item
  const notificationsMenuItem = document.querySelector(
    '.profile-menu a[href="../../user/notifications/notification.html"]'
  );
  if (notificationsMenuItem) {
    notificationsMenuItem.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "../../user/notifications/notification.html";
    });
  }

  // My Tickets menu item
  const ticketsMenuItem = document.querySelector(
    '.profile-menu a[href="../../trips/e-ticket/e-ticket.html"]'
  );
  if (ticketsMenuItem) {
    ticketsMenuItem.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "../../trips/e-ticket/e-ticket.html";
    });
  }

  // Explore Us menu item
  const exploreMenuItem = document.querySelector(
    '.profile-menu a[href="../../user/explore/explore.html"]'
  );
  if (exploreMenuItem) {
    exploreMenuItem.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "../../user/explore/explore.html";
    });
  }

  // Settings menu item
  const settingsMenuItem = document.querySelector(
    '.profile-menu a[href="../../user/settings/settings.html"]'
  );
  if (settingsMenuItem) {
    settingsMenuItem.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "../../user/settings/settings.html";
    });
  }
});

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", function (e) {
  e.preventDefault();

  window.location.href = "../../user/logout/logout.html";
});

// Delete Account functionality
document
  .getElementById("deleteAccountBtn")
  .addEventListener("click", function (e) {
    e.preventDefault();

    window.location.href = "../../user/delete-account/delete.html";
  });

// Profile nav item - prevent default (already on profile page)
document
  .getElementById("profileNavItem")
  .addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

// Bottom Navigation - Handle nav item clicks
document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".nav-item:not(.active)");

  // Attach handlers by label text (robust approach)
  navItems.forEach((item) => {
    const label = (item.textContent || "").trim().toLowerCase();

    if (label === "home" || label.includes("home")) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = "../../booking/home/home.html";
      });
    }

    if (label === "my trip" || label.includes("trip")) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = "../../trips/trip-list/trip.html";
      });
    }

    if (label === "explore" || label.includes("explore")) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = "../../user/explore/explore.html";
      });
    }

    if (label === "profile" || label.includes("profile")) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = "../../user/profile/profile.html";
      });
    }
  });
});
