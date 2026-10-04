// =====================================================
// USER GREETING
document.addEventListener("DOMContentLoaded", function () {
  const greetingsElement = document.getElementById("greetings");

  if (greetingsElement) {
    const userName = localStorage.getItem("userName");
    const currentHour = new Date().getHours();
    let timeGreeting = "Hi";

    // if (currentHour < 12) {
    //   timeGreeting = "Good morning";
    // } else if (currentHour < 18) {
    //   timeGreeting = "Good afternoon";
    // } else {
    //   timeGreeting = "Good evening";
    // }

    if (userName) {
      greetingsElement.textContent = `${timeGreeting}, ${userName}`;
    } else {
      greetingsElement.textContent = `${timeGreeting}, Traveler`;
    }

    console.log("Greeting set:", greetingsElement.textContent);
  }
});
// =====================================================
// DROPDOWN FUNCTIONALITY
// =====================================================
document.addEventListener("DOMContentLoaded", function () {
  const seeAllLinks = document.querySelectorAll(".see-all");

  seeAllLinks.forEach((seeAllLink) => {
    seeAllLink.addEventListener("click", function (e) {
      e.preventDefault();

      // Find the carousel in the same section
      const section = this.closest(".section");
      const carouselWrapper = section.querySelector(".carousel-wrapper");
      const carousel = section.querySelector(".carousel");

      if (carousel && carouselWrapper) {
        console.log("See all clicked! Toggling dropdown...");
        toggleDropdown(carouselWrapper, carousel, this);
      }
    });
  });
});

function toggleDropdown(carouselWrapper, carousel, seeAllLink) {
  const isExpanded = carouselWrapper.classList.contains("expanded");

  if (isExpanded) {
    // Collapse
    carouselWrapper.classList.remove("expanded");
    carousel.style.maxHeight = "300px"; // Original height
    carousel.style.overflowY = "hidden";
    carousel.style.display = "flex"; // Back to horizontal scroll
    carousel.style.flexWrap = "nowrap";
    seeAllLink.innerHTML =
      'See all <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(90deg);"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.79175 10.2083L8.60425 6.99996L3.79175 3.79163L4.37508 2.91663L10.5001 6.99996L4.37508 11.0833L3.79175 10.2083Z" fill="#007A8C" /></svg>';
  } else {
    // Expand - Show as 2 column grid
    carouselWrapper.classList.add("expanded");

    // Change to grid layout with 2 columns
    carousel.style.display = "grid";
    carousel.style.gridTemplateColumns = "repeat(2, 1fr)";
    carousel.style.gap = "12px";

    // Calculate the full height needed
    const scrollHeight = carousel.scrollHeight;
    carousel.style.maxHeight = "none";
    carousel.style.overflowY = "visible";

    // Change text to "See less" with upward arrow
    seeAllLink.innerHTML =
      'See less <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(-90deg);"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.79175 10.2083L8.60425 6.99996L3.79175 3.79163L4.37508 2.91663L10.5001 6.99996L4.37508 11.0833L3.79175 10.2083Z" fill="#007A8C" /></svg>';

    // Smooth scroll into view
    setTimeout(() => {
      carouselWrapper.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }
}
// =====================================================
// DEBUG CLICK LOGGER
// =====================================================
(function addClickLogger() {
  if (window.__clickLoggerAdded) return;
  document.addEventListener(
    "click",
    function (e) {
      try {
        const tgt = e.target;
        console.log(
          "DEBUG_CLICK -> target:",
          tgt,
          "class:",
          tgt.className,
          "text:",
          (tgt.textContent || "").trim()
        );
        if (e.composedPath) {
          const path = e.composedPath().map((el) => {
            if (!el) return el;
            if (el.tagName)
              return el.tagName + (el.className ? "." + el.className : "");
            return el;
          });
          console.log("DEBUG_CLICK path:", path);
        }
      } catch (err) {
        console.log("DEBUG_CLICK error", err);
      }
    },
    true
  );
  window.__clickLoggerAdded = true;
})();

// =====================================================
// NOTIFICATION BUTTON
// =====================================================
document.addEventListener("DOMContentLoaded", function () {
  console.log("Script loaded!");

  const notificationBtn = document.getElementById("notification-btn");

  if (notificationBtn) {
    console.log("notification button found!");

    notificationBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("notification button clicked! Navigating to search page...");
      window.location.href = "../../user/notifications/notification.html";
    });
  }
});

// =====================================================
// BOOK BUTTON
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const bookbtns = document.querySelectorAll(".book-btn");
  if (bookbtns.length > 0) {
    bookbtns.forEach((bookbtn) => {
      bookbtn.addEventListener("click", function (e) {
        e.preventDefault();
        const card = this.closest(".destination-card");
        let destination = "London";
        let country = "UK";

        if (card) {
          destination = card.dataset.destination || destination;
          country = card.dataset.country || country;
        }

        console.log(`Booking flight to ${destination}, ${country}...`);
        localStorage.setItem("selectedDestinationCity", destination);
        localStorage.setItem("selectedDestinationCountry", country);

        const targetUrl = `../../booking/flight-details/flight.html?to=${encodeURIComponent(destination)}&country=${encodeURIComponent(country)}`;
        window.location.href = targetUrl;
      });
    });
  }
});

// =====================================================
// MY TRIP NAVIGATION
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const myTripNavItem = document.querySelector(".nav-item:nth-child(2)");
  if (myTripNavItem) {
    myTripNavItem.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("My Trip clicked! Navigating to trip page...");
      window.location.href = "../../trips/trip-list/trip.html";
    });
  }
});

// =====================================================
// EXPLORE NAVIGATION
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");
  if (navItems.length > 0) {
    navItems.forEach((item) => {
      const label = (item.textContent || "").trim().toLowerCase();
      if (label === "explore" || label.includes("explore")) {
        item.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          console.log("Explore clicked! Navigating to explore page...");
          window.location.href = "../../user/explore/explore.html";
        });
      }
    });
  }
});

// =====================================================
// PROFILE NAVIGATION
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");
  if (navItems.length > 0) {
    navItems.forEach((item) => {
      const label = (item.textContent || "").trim().toLowerCase();
      if (label === "profile" || label.includes("profile")) {
        item.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          console.log("Profile clicked! Navigating to profile page...");
          window.location.href = "../../user/profile/profile.html";
        });
      }
    });
  }
});

// =====================================================
// DESKTOP NAVIGATION
// =====================================================
document.addEventListener("DOMContentLoaded", function () {
  const desktopNavLinks = document.querySelectorAll(".desktop-nav a");

  desktopNavLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      desktopNavLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      const linkText = this.textContent.trim().toLowerCase();

      switch (linkText) {
        case "home":
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;
        case "my trip":
          window.location.href = "../../trips/trip-list/trip.html";
          break;
        case "explore":
          window.location.href = "../../user/explore/explore.html";
          break;
        case "profile":
          window.location.href = "../../user/profile/profile.html";
          break;
        default:
          console.log("Navigation link not configured:", linkText);
      }
    });
  });

  const bottomNavLinks = document.querySelectorAll(".bottom-nav .nav-item");

  bottomNavLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      bottomNavLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      const href = this.getAttribute("href");
      if (href && href !== "#") {
        window.location.href = href;
      }
    });
  });

  // Set active navigation based on current page
  function setActiveNav() {
    const currentPage = window.location.pathname;

    desktopNavLinks.forEach((link) => {
      const linkText = link.textContent.trim().toLowerCase();

      if (
        (currentPage.includes("home.html") && linkText === "home") ||
        (currentPage.includes("trip.html") && linkText === "my trip") ||
        (currentPage.includes("explore.html") && linkText === "explore") ||
        (currentPage.includes("profile.html") && linkText === "profile")
      ) {
        link.classList.add("active");
      }
    });

    bottomNavLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && currentPage.includes(href.split("/").pop())) {
        link.classList.add("active");
      }
    });
  }

  setActiveNav();
});
// the code below will get the user's location and display the Nigerian state

const locationText = document.getElementById("location-text");

// Step 1: Get user's GPS location
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(successLocation, errorLocation);
} else {
  locationText.textContent = "Location not supported";
}

// Step 2: If location is successful
function successLocation(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  getStateFromCoordinates(latitude, longitude);
}

// Step 3: If user denies location
function errorLocation() {
  locationText.textContent = "Location permission denied";
}

// Step 4: Call API to get Nigerian state
function getStateFromCoordinates(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const state = data.address.state;
      const country = data.address.country;

      locationText.textContent = `${state}, ${country}`;
    })
    .catch(() => {
      locationText.textContent = "Unable to detect state";
    });
}
