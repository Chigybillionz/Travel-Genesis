/**
 * Travel Genesis - Notifications Controller
 * Connects pages/user/notifications to GET /api/notifications,
 * PATCH /api/notifications/:id/read, and PATCH /api/notifications/read-all
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const backButton = document.querySelector("#back-button");
  const markAllBtn = document.querySelector("#mark-all-btn");
  const tabAll = document.querySelector("#tab-all");
  const tabUnread = document.querySelector("#tab-unread");
  const countAllEl = document.querySelector("#count-all");
  const countUnreadEl = document.querySelector("#count-unread");
  const feedArea = document.querySelector("#notifications-list");
  const loadingEl = document.querySelector("#notif-loading");
  const emptyState = document.querySelector("#empty-state");
  const emptyTitle = document.querySelector("#empty-title");
  const emptyDesc = document.querySelector("#empty-desc");
  const emptyActionBtn = document.querySelector("#empty-action-btn");
  const statusTime = document.querySelector("#status-time");

  // State
  let notifications = [];
  let currentFilter = "all"; // "all" | "unread"

  // 1. Clock in status bar
  updateClock();
  setInterval(updateClock, 30000);

  function updateClock() {
    if (!statusTime) return;
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    statusTime.textContent = `${hours}:${minutes}`;
  }

  // 2. Back Navigation
  if (backButton) {
    backButton.addEventListener("click", () => {
      if (document.referrer && document.referrer.includes(window.location.host)) {
        window.history.back();
      } else {
        window.location.href = "../../booking/home/home.html";
      }
    });
  }

  // 3. Tab Switching
  if (tabAll) {
    tabAll.addEventListener("click", () => {
      setFilter("all");
    });
  }

  if (tabUnread) {
    tabUnread.addEventListener("click", () => {
      setFilter("unread");
    });
  }

  function setFilter(filter) {
    currentFilter = filter;
    if (filter === "all") {
      tabAll.classList.add("active");
      tabUnread.classList.remove("active");
    } else {
      tabUnread.classList.add("active");
      tabAll.classList.remove("active");
    }
    renderNotifications();
  }

  // 4. Mark all as read handler
  if (markAllBtn) {
    markAllBtn.addEventListener("click", async () => {
      const hasUnread = notifications.some((n) => !n.isRead);
      if (!hasUnread) return;

      try {
        markAllBtn.disabled = true;
        if (window.API && API.notifications) {
          await API.notifications.markAllAsRead();
        }

        // Locally mark all as read
        notifications.forEach((n) => {
          n.isRead = true;
        });

        updateBadges();
        renderNotifications();
        showToast("All notifications marked as read");
      } catch (err) {
        console.error("Failed to mark all as read:", err.message);
        showToast("Failed to update all alerts");
      } finally {
        markAllBtn.disabled = false;
      }
    });
  }

  // 5. Initial Data Fetch
  loadNotifications();

  async function loadNotifications() {
    // Check authentication
    if (!window.API || !API.isAuthenticated()) {
      showUnauthenticatedState();
      return;
    }

    try {
      showLoading(true);
      const res = await API.notifications.getAll();

      if (res && res.success && Array.isArray(res.data)) {
        notifications = res.data;
      } else {
        notifications = [];
      }

      updateBadges();
      renderNotifications();
    } catch (err) {
      console.warn("Could not fetch notifications from server:", err.message);
      // Fallback empty state
      notifications = [];
      updateBadges();
      renderNotifications();
    } finally {
      showLoading(false);
    }
  }

  // 6. Update counts and button states
  function updateBadges() {
    const totalCount = notifications.length;
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    if (countAllEl) countAllEl.textContent = totalCount;
    if (countUnreadEl) {
      countUnreadEl.textContent = unreadCount;
      if (unreadCount === 0) {
        countUnreadEl.classList.remove("unread-badge");
      } else {
        countUnreadEl.classList.add("unread-badge");
      }
    }

    const statTotalEl = document.getElementById("stat-total-alerts");
    const statUnreadEl = document.getElementById("stat-unread-alerts");
    if (statTotalEl) statTotalEl.textContent = totalCount;
    if (statUnreadEl) statUnreadEl.textContent = unreadCount;

    if (markAllBtn) {
      markAllBtn.disabled = unreadCount === 0;
    }
  }

  // 7. Render Notifications List
  function renderNotifications() {
    let list = notifications;
    if (currentFilter === "unread") {
      list = notifications.filter((n) => !n.isRead);
    }

    if (list.length === 0) {
      feedArea.style.display = "none";
      emptyState.style.display = "flex";

      if (currentFilter === "unread") {
        emptyTitle.textContent = "All caught up! 🎉";
        emptyDesc.textContent = "You don't have any unread notifications right now.";
        emptyActionBtn.innerHTML = '<i class="fa-solid fa-list-check"></i> <span>View All Alerts</span>';
        emptyActionBtn.onclick = (e) => {
          e.preventDefault();
          setFilter("all");
        };
      } else {
        emptyTitle.textContent = "There's nothing here";
        emptyDesc.textContent = "You're all caught up with your latest travel updates.";
        emptyActionBtn.innerHTML = '<i class="fa-solid fa-plane-departure"></i> <span>Explore Flights</span>';
        emptyActionBtn.onclick = null;
        emptyActionBtn.href = "../../booking/home/home.html";
      }
      return;
    }

    emptyState.style.display = "none";
    feedArea.style.display = "flex";
    feedArea.innerHTML = "";

    list.forEach((item) => {
      const card = document.createElement("div");
      card.className = `notif-card ${item.isRead ? "" : "unread"}`;
      card.dataset.id = item._id;

      // Icon info by type
      const iconInfo = getIconInfo(item.type);

      // Relative timestamp
      const relativeTime = formatRelativeTime(item.createdAt);

      // Action link if booking
      const actionHtml =
        item.type === "booking"
          ? `<a href="../../trips/trip-list/trip.html" class="notif-action-link" title="Open My Trips"><i class="fa-solid fa-suitcase"></i> View Trip</a>`
          : "";

      card.innerHTML = `
        <div class="notif-icon-wrap ${iconInfo.className}">
          <i class="${iconInfo.icon}"></i>
        </div>
        <div class="notif-body">
          <div class="notif-header-row">
            <h4 class="notif-title">${escapeHtml(item.title)}</h4>
            ${!item.isRead ? '<span class="notif-unread-dot" title="Unread"></span>' : ""}
          </div>
          <p class="notif-message">${escapeHtml(item.message)}</p>
          <div class="notif-footer">
            <span class="notif-time">${relativeTime}</span>
            ${actionHtml}
          </div>
        </div>
      `;

      // Mark single item read on card click
      card.addEventListener("click", (e) => {
        // If clicking directly on action link, let navigation occur
        if (e.target.closest(".notif-action-link")) return;

        if (!item.isRead) {
          markAsReadLocally(item._id);
          if (window.API && API.notifications) {
            API.notifications.markAsRead(item._id).catch((err) => {
              console.warn("Server markAsRead warning:", err.message);
            });
          }
        }
      });

      feedArea.appendChild(card);
    });
  }

  function markAsReadLocally(id) {
    const target = notifications.find((n) => n._id === id);
    if (target && !target.isRead) {
      target.isRead = true;
      updateBadges();
      renderNotifications();
    }
  }

  // 8. Helper: Type to Icon
  function getIconInfo(type) {
    switch (type) {
      case "booking":
        return {
          icon: "fa-solid fa-plane-departure",
          className: "notif-icon-booking",
        };
      case "flight_update":
        return {
          icon: "fa-solid fa-clock-rotate-left",
          className: "notif-icon-flight_update",
        };
      case "promo":
        return {
          icon: "fa-solid fa-ticket",
          className: "notif-icon-promo",
        };
      case "system":
      default:
        return {
          icon: "fa-solid fa-bell",
          className: "notif-icon-system",
        };
    }
  }

  // 9. Helper: Format Relative Time
  function formatRelativeTime(dateString) {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";

    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return "Yesterday";
    if (diffDay < 7) return `${diffDay}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 10. Unauthenticated state
  function showUnauthenticatedState() {
    showLoading(false);
    feedArea.style.display = "none";
    emptyState.style.display = "flex";
    emptyTitle.textContent = "Sign In Required";
    emptyDesc.textContent = "Sign in to your Travel Genesis account to view flight updates, trip confirmations, and notices.";
    emptyActionBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> <span>Sign In</span>';
    emptyActionBtn.href = "../../auth/login/login.html";
    if (markAllBtn) markAllBtn.disabled = true;
  }

  function showLoading(isLoading) {
    if (loadingEl) {
      loadingEl.style.display = isLoading ? "flex" : "none";
    }
  }

  // 11. Toast utility
  function showToast(message) {
    let toast = document.querySelector(".toast-msg");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast-msg";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #22c55e;"></i> <span>${escapeHtml(message)}</span>`;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }
});
