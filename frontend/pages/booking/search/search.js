/**
 * Travel Genesis - Flights & Destinations Search Handler
 * Integrates search input with /api/flights/search & destinations catalog
 */

document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.querySelector("#back-btn");
  if (backButton) {
    backButton.addEventListener("click", function () {
      window.location.href = "../../booking/home/home.html";
    });
  }

  const searchInput = document.querySelector(".search-input");
  const resultsHeader = document.querySelector(".results-header");
  const destinationCard = document.querySelector(".destination-card");

  // Destination dataset for instant filtering
    const DESTINATIONS = [
    { city: "London", country: "UK", rating: "4.5", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop" },
    { city: "Sydney", country: "Australia", rating: "4.82", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&h=400&fit=crop" },
    { city: "Cape Town", country: "South Africa", rating: "4.82", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&h=400&fit=crop" },
    { city: "Los Angeles", country: "USA", rating: "4.87", image: "https://images.unsplash.com/photo-1518115277884-3998b637d7a8?w=600&h=400&fit=crop" },
    { city: "Paris", country: "France", rating: "4.88", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop" },
    { city: "Dubai", country: "UAE", rating: "4.9", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop" },
    { city: "Rome", country: "Italy", rating: "4.86", image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&h=400&fit=crop" },
    { city: "Barcelona", country: "Spain", rating: "4.85", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop" },
    { city: "Tokyo", country: "Japan", rating: "4.95", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop" },
    { city: "Santorini", country: "Greece", rating: "4.92", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop" }
  ];

  // Default card click -> flight details
  if (destinationCard) {
    destinationCard.style.cursor = "pointer";
    destinationCard.addEventListener("click", () => {
      window.location.href = `../../booking/flight-details/flight.html?to=London&country=UK`;
    });
  }

  // Handle live search
  if (searchInput) {
    // Focus search on load
    searchInput.focus();

    searchInput.addEventListener("input", function (e) {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        if (resultsHeader) resultsHeader.textContent = "Popular Destinations (7)";
        return;
      }

      const matches = DESTINATIONS.filter(
        d => d.city.toLowerCase().includes(query) || d.country.toLowerCase().includes(query)
      );

      if (resultsHeader) {
        resultsHeader.textContent = `Results found (${matches.length})`;
      }

      if (matches.length > 0) {
        const first = matches[0];
        if (destinationCard) {
          destinationCard.style.display = "block";
          const img = destinationCard.querySelector(".card-image");
          const nameEl = document.getElementById("search-dest-name");
          const ratingEl = document.getElementById("search-dest-rating");
          if (nameEl) nameEl.textContent = first.city.toUpperCase() + ", " + first.country.toUpperCase();
          if (ratingEl) ratingEl.innerHTML = '<i class="fa-solid fa-star" style="color: #FCB131;"></i> ' + first.rating;
          if (img) img.src = first.image;

          destinationCard.onclick = () => {
            window.location.href = `../../booking/flight-details/flight.html?to=${encodeURIComponent(first.city)}&country=${encodeURIComponent(first.country)}`;
          };
        }
      } else {
        if (destinationCard) destinationCard.style.display = "none";
      }
    });

    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `../../booking/flight-details/flight.html?to=${encodeURIComponent(query)}`;
        }
      }
    });
  }
});
