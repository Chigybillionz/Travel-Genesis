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
    {
      city: "Sydney",
      country: "Australia",
      rating: "4.9",
      reviews: "340",
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop",
      flightCount: "3 flights daily"
    },
    {
      city: "Toronto",
      country: "Canada",
      rating: "4.8",
      reviews: "290",
      image: "../../../assets/images/destinations/Toronto, Canada.png",
      flightCount: "3 flights daily"
    },
    {
      city: "London",
      country: "UK",
      rating: "4.9",
      reviews: "520",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop",
      flightCount: "3 direct flights"
    },
    {
      city: "New York",
      country: "USA",
      rating: "4.85",
      reviews: "410",
      image: "../../../assets/images/destinations/New York City, USA.png",
      flightCount: "3 flights daily"
    },
    {
      city: "Dubai",
      country: "UAE",
      rating: "4.95",
      reviews: "680",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
      flightCount: "3 flights daily"
    },
    {
      city: "Paris",
      country: "France",
      rating: "4.9",
      reviews: "480",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
      flightCount: "3 direct flights"
    },
    {
      city: "Tokyo",
      country: "Japan",
      rating: "4.92",
      reviews: "540",
      image: "../../../assets/images/destinations/Tokyo, Japan.png",
      flightCount: "3 flights daily"
    }
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
