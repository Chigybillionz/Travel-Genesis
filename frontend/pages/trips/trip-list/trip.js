/**
 * Travel Genesis - My Trips Page Handler
 */

document.addEventListener("DOMContentLoaded", function () {
  // Sync passenger name from logged-in user
  const passengerNameElement = document.getElementById("passengerName");
  if (passengerNameElement) {
    const cachedName = localStorage.getItem("userFullName") || localStorage.getItem("userName");
    if (cachedName) {
      passengerNameElement.textContent = cachedName;
    } else if (window.API && window.API.getUser()) {
      passengerNameElement.textContent = window.API.getUser().name;
    }
  }

  // View Ticket Navigation
  const viewBtn = document.getElementById("viewBtn");
  if (viewBtn) {
    viewBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "../../trips/e-ticket/e-ticket.html";
    });
  }

  // Cancel Booking Navigation
  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "../../trips/cancel-booking/cancelbooking.html";
    });
  }

  // Filter Tabs
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      tabButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");
      const listColumn = document.querySelector(".trips-list-column");
      const flightCard = document.querySelector(".desktop-flight-card");

      if (filter === "upcoming") {
        if (flightCard) flightCard.style.display = "block";
        const emptyState = document.getElementById("trips-empty-state");
        if (emptyState) emptyState.remove();
      } else {
        if (flightCard) flightCard.style.display = "none";
        let emptyState = document.getElementById("trips-empty-state");
        if (!emptyState && listColumn) {
          emptyState = document.createElement("div");
          emptyState.id = "trips-empty-state";
          emptyState.style.cssText =
            "background:#fff;border-radius:16px;padding:48px 24px;text-align:center;color:#64748B;border:1px dashed #CBD5E1;";
          emptyState.innerHTML = `
            <i class="fa-solid fa-plane-slash" style="font-size:36px;color:#94A3B8;margin-bottom:12px;"></i>
            <h3 style="color:#0F172A;font-size:18px;margin-bottom:6px;">No ${filter} trips found</h3>
            <p style="font-size:14px;max-width:320px;margin:0 auto 16px;">You don't have any ${filter} journeys registered in this category.</p>
            <a href="../../booking/home/home.html" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:#007A8C;color:#fff;border-radius:9999px;text-decoration:none;font-weight:700;font-size:14px;">Explore Flights</a>
          `;
          listColumn.appendChild(emptyState);
        }
      }
    });
  });

  // Mobile Bottom Navigation Handlers
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");
  navItems.forEach((item) => {
    const label = (item.textContent || "").trim().toLowerCase();

    if (label.includes("home")) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "../../booking/home/home.html";
      });
    }

    if (label.includes("explore")) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "../../user/explore/explore.html";
      });
    }

    if (label.includes("profile")) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "../../user/profile/profile.html";
      });
    }
  });
});
