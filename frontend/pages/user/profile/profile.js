/**
 * Profile page
 * - Renders identity from cache first (no flicker), then syncs with /api/users/profile
 * - Computes live travel stats from /api/bookings/my-trips (amounts in Naira)
 * - Shows unread notification count from /api/notifications
 */

const formatNaira = (amount) => `₦${Number(amount || 0).toLocaleString("en-NG")}`;

function getInitials(name) {
  if (!name) return "TG";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ? parts[0][0] : "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "TG";
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderIdentity(user) {
  const name = user.name || "Guest Traveler";
  const email = user.email || "Sign in to view your account";

  document.querySelectorAll(".profile-name").forEach((el) => (el.textContent = name));
  document.querySelectorAll(".profile-email").forEach((el) => (el.textContent = email));

  const avatar = document.getElementById("profile-avatar");
  if (avatar) avatar.textContent = getInitials(user.name);

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
  const cachedUser = window.API && API.getUser ? API.getUser() : null;

  renderIdentity({
    name: (cachedUser && cachedUser.name) || cachedName,
    email: (cachedUser && cachedUser.email) || cachedEmail,
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
});
