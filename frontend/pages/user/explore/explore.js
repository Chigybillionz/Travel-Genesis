/**
 * Travel Genesis - Explore Controller
 * Renders curated destinations, interactive category filters,
 * live search, community personas, and links into flight booking flow.
 */

const EXPLORE_CATALOG = [
  {
    id: "dest-santorini",
    city: "Santorini",
    country: "Greece",
    name: "Santorini Cliffside Villas",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    rating: 4.92,
    priceStarting: 599,
    category: "beach",
    personas: ["leisure", "all"],
    tags: ["Aegean", "Romantic", "Island"],
    description: "Breathtaking caldera sunsets, whitewashed cliffside suites, and deep blue Aegean waters.",
  },
  {
    id: "dest-kyoto",
    city: "Tokyo",
    country: "Japan",
    name: "Kyoto & Tokyo Heritage",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    rating: 4.95,
    priceStarting: 850,
    category: "historic",
    personas: ["adventure", "all"],
    tags: ["Temples", "Culture", "Gardens"],
    description: "Serene bamboo groves, thousand-year-old shinto shrines, and world-renowned culinary culture.",
  },
  {
    id: "dest-bali",
    city: "Sydney",
    country: "Australia",
    name: "Sydney Coastal Escapes",
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
    rating: 4.91,
    priceStarting: 920,
    category: "beach",
    personas: ["adventure", "all"],
    tags: ["Harbor", "Bondi Beach", "Coastal"],
    description: "Iconic Opera House harbor views, golden surfing beaches, and dynamic coastal dining.",
  },
  {
    id: "dest-paris",
    city: "Paris",
    country: "France",
    name: "Paris City of Lights",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    rating: 4.88,
    priceStarting: 740,
    category: "luxury",
    personas: ["leisure", "business", "all"],
    tags: ["Romance", "Museums", "Cuisine"],
    description: "Historic Seine river walks, iconic Eiffel views, haute couture, and Michelin-starred dining.",
  },
  {
    id: "dest-rome",
    city: "Rome",
    country: "Italy",
    name: "Rome Eternal City",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    rating: 4.86,
    priceStarting: 620,
    category: "historic",
    personas: ["leisure", "all"],
    tags: ["Colosseum", "History", "Piazzas"],
    description: "Walk in the footsteps of emperors, marvel at the Vatican, and savor authentic Roman pasta.",
  },
  {
    id: "dest-dubai",
    city: "Dubai",
    country: "UAE",
    name: "Dubai Skyline & Safari",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    priceStarting: 520,
    category: "luxury",
    personas: ["business", "all"],
    tags: ["Skyscrapers", "Luxury", "Desert"],
    description: "Futuristic Burj Khalifa views, world-class shopping, and private desert luxury excursions.",
  },
  {
    id: "dest-toronto",
    city: "Toronto",
    country: "Canada",
    name: "Toronto Waterfront Skyline",
    imageUrl: "https://images.unsplash.com/photo-1507992781348-310259076fa0?auto=format&fit=crop&w=800&q=80",
    rating: 4.84,
    priceStarting: 780,
    category: "city",
    personas: ["business", "all"],
    tags: ["CN Tower", "Lakeside", "Culture"],
    description: "Dynamic cosmopolitan arts districts, picturesque Lake Ontario harbor, and cultural diversity.",
  },
  {
    id: "dest-newyork",
    city: "New York",
    country: "USA",
    name: "New York Iconic Metropolis",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    rating: 4.89,
    priceStarting: 980,
    category: "city",
    personas: ["business", "adventure", "all"],
    tags: ["Broadway", "Skyline", "Central Park"],
    description: "The city that never sleeps: Manhattan skyline, Broadway theaters, and world-class energy.",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const gridEl = document.getElementById("destinations-grid");
  const countEl = document.getElementById("dest-count-display");
  const searchInput = document.getElementById("explore-search-input");
  const clearSearchBtn = document.getElementById("clear-search-btn");
  const filterChips = document.querySelectorAll(".filter-chip");
  const personaCards = document.querySelectorAll(".persona-card");

  let currentCategory = "all";
  let currentPersona = "all";
  let searchQuery = "";

  // Render destinations
  render();

  // Category filter clicks
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentCategory = chip.dataset.category || "all";
      render();
    });
  });

  // Persona card clicks
  personaCards.forEach((card) => {
    card.addEventListener("click", () => {
      personaCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      currentPersona = card.dataset.persona || "all";
      render();
    });
  });

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchQuery ? "block" : "none";
      }
      render();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      searchQuery = "";
      clearSearchBtn.style.display = "none";
      render();
    });
  }

  function render() {
    if (!gridEl) return;

    let items = EXPLORE_CATALOG.filter((item) => {
      // Category filter
      if (currentCategory !== "all" && item.category !== currentCategory) {
        return false;
      }
      // Persona filter
      if (currentPersona !== "all" && !item.personas.includes(currentPersona)) {
        return false;
      }
      // Search query
      if (searchQuery) {
        const text = `${item.city} ${item.country} ${item.name} ${item.description} ${(item.tags || []).join(" ")}`.toLowerCase();
        if (!text.includes(searchQuery)) return false;
      }
      return true;
    });

    if (countEl) {
      countEl.textContent = `Showing ${items.length} destination${items.length === 1 ? "" : "s"}`;
    }

    if (items.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
          <i class="fa-solid fa-compass" style="font-size: 38px; color: #94a3b8; margin-bottom: 12px;"></i>
          <h4 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">No destinations matched your criteria</h4>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">Try adjusting your search terms or picking another category.</p>
          <button id="reset-filters-btn" style="background: #007A8C; color: #fff; border: none; padding: 8px 18px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer;">
            Reset All Filters
          </button>
        </div>
      `;

      const resetBtn = document.getElementById("reset-filters-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          currentCategory = "all";
          currentPersona = "all";
          searchQuery = "";
          if (searchInput) searchInput.value = "";
          if (clearSearchBtn) clearSearchBtn.style.display = "none";
          filterChips.forEach((c) => c.classList.remove("active"));
          if (filterChips[0]) filterChips[0].classList.add("active");
          personaCards.forEach((c) => c.classList.remove("active"));
          if (personaCards[0]) personaCards[0].classList.add("active");
          render();
        });
      }
      return;
    }

    gridEl.innerHTML = "";
    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "explore-card";

      const tagsHtml = (item.tags || [])
        .map((tag) => `<span class="tag-badge">${tag}</span>`)
        .join("");

      card.innerHTML = `
        <div class="card-media">
          <img src="${item.imageUrl}" alt="${item.city}" class="card-img" loading="lazy" />
          <div class="card-rating-badge"><i class="fa-solid fa-star"></i> ${item.rating}</div>
          <div class="card-price-pill">From $${item.priceStarting}</div>
        </div>
        <div class="card-body">
          <div class="card-title-row">
            <h3 class="card-city">${item.city}</h3>
            <p class="card-country">${item.country}</p>
          </div>
          <p class="card-desc">${item.description}</p>
          <div class="card-tags">${tagsHtml}</div>
          <a href="../../booking/flight-details/flight.html?to=${encodeURIComponent(item.city)}&country=${encodeURIComponent(item.country)}" class="book-flight-btn">
            <span>Book Flight</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      `;

      gridEl.appendChild(card);
    });
  }
});
