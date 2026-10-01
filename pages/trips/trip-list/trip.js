// Back button
const backBtn = document.getElementById("backBtn");
if (backBtn) {
  backBtn.addEventListener("click", function () {
    window.location.href = "../../booking/home/home.html";
  });
}

// View Ticket
document.getElementById("viewBtn").addEventListener("click", function () {
  window.location.href = "../../trips/e-ticket/e-ticket.html";
});

// Cancel Booking

document.getElementById("cancelBtn").addEventListener("click", function () {
  window.location.href = "../../trips/cancel-booking/cancelbooking.html";
});

// Bottom Navigation
document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".nav-item");

  // Attach handlers by label text (more robust than fixed indices)
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
        // Already on trip page, no navigation needed
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
  }); // for the delete account button
  document.addEventListener("DOMContentLoaded", function () {
    const logoutbtn = document.getElementById("btn-cancelbtn-delete");
    if (logoutbtn) {
      logoutbtn.addEventListener("click", function () {
        console.log("returning to splash page...");

        window.location.href = "../../onboarding/splash/splash.html";
      });
    }
  });

  cancelBtn;
});
