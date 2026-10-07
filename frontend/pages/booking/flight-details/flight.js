/**
 * Travel Genesis - Choose Flight Controller
 * Dynamically renders flights and timings based on selected destination
 * (e.g. Lagos -> Sydney, Lagos -> Toronto, Lagos -> London, etc.)
 */

// Comprehensive destination catalog with route-specific timings, durations, and airlines
const FLIGHT_CATALOG = {
  Sydney: {
    city: "Sydney",
    country: "Australia",
    code: "SYD",
    flag: "🇦🇺",
    badge: "100% on time",
    flights: [
      {
        id: "syd-1",
        flightNumber: "QF-42",
        airline: "Qantas Airways",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Sydney",
        destinationCountry: "Australia",
        destinationCode: "SYD",
        depTime: "06:00 AM",
        arrTime: "07:45 AM",
        arrNotice: "+1 day",
        duration: "21h 45m",
        stops: "1 Stop (DOH)",
        price: 1380000,
        badge: "100% on time",
      },
      {
        id: "syd-2",
        flightNumber: "QR-904",
        airline: "Qatar Airways",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Sydney",
        destinationCountry: "Australia",
        destinationCode: "SYD",
        depTime: "01:30 PM",
        arrTime: "04:15 PM",
        arrNotice: "+1 day",
        duration: "22h 45m",
        stops: "1 Stop (DOH)",
        price: 1320000,
        badge: "Fastest route",
      },
      {
        id: "syd-3",
        flightNumber: "SQ-718",
        airline: "Singapore Airlines",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Sydney",
        destinationCountry: "Australia",
        destinationCode: "SYD",
        depTime: "09:15 PM",
        arrTime: "11:30 PM",
        arrNotice: "+1 day",
        duration: "22h 15m",
        stops: "1 Stop (SIN)",
        price: 1425000,
        badge: "Best rated",
      },
    ],
  },
  Toronto: {
    city: "Toronto",
    country: "Canada",
    code: "YYZ",
    flag: "🇨🇦",
    badge: "100% on time",
    flights: [
      {
        id: "tor-1",
        flightNumber: "AC-801",
        airline: "Air Canada",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Toronto",
        destinationCountry: "Canada",
        destinationCode: "YYZ",
        depTime: "08:30 AM",
        arrTime: "06:45 PM",
        arrNotice: "same day",
        duration: "15h 15m",
        stops: "1 Stop (FRA)",
        price: 1170000,
        badge: "100% on time",
      },
      {
        id: "tor-2",
        flightNumber: "DL-452",
        airline: "Delta Air Lines",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Toronto",
        destinationCountry: "Canada",
        destinationCode: "YYZ",
        depTime: "01:00 PM",
        arrTime: "11:30 PM",
        arrNotice: "same day",
        duration: "15h 30m",
        stops: "1 Stop (ATL)",
        price: 1110000,
        badge: "Best price",
      },
      {
        id: "tor-3",
        flightNumber: "BA-198",
        airline: "British Airways",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Toronto",
        destinationCountry: "Canada",
        destinationCode: "YYZ",
        depTime: "10:00 PM",
        arrTime: "09:15 AM",
        arrNotice: "+1 day",
        duration: "16h 15m",
        stops: "1 Stop (LHR)",
        price: 1215000,
        badge: "Popular choice",
      },
    ],
  },
  London: {
    city: "London",
    country: "UK",
    code: "LHR",
    flag: "🇬🇧",
    badge: "100% on time",
    flights: [
      {
        id: "lon-1",
        flightNumber: "BA-075",
        airline: "British Airways",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "London",
        destinationCountry: "UK",
        destinationCode: "LHR",
        depTime: "07:00 AM",
        arrTime: "02:30 PM",
        arrNotice: "same day",
        duration: "6h 30m",
        stops: "Non-stop",
        price: 1020000,
        badge: "100% on time",
      },
      {
        id: "lon-2",
        flightNumber: "VS-412",
        airline: "Virgin Atlantic",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "London",
        destinationCountry: "UK",
        destinationCode: "LHR",
        depTime: "01:15 PM",
        arrTime: "08:45 PM",
        arrNotice: "same day",
        duration: "6h 30m",
        stops: "Non-stop",
        price: 975000,
        badge: "Best service",
      },
      {
        id: "lon-3",
        flightNumber: "P4-7578",
        airline: "Air Peace",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "London",
        destinationCountry: "UK",
        destinationCode: "LHR",
        depTime: "10:45 PM",
        arrTime: "06:15 AM",
        arrNotice: "+1 day",
        duration: "6h 30m",
        stops: "Non-stop",
        price: 885000,
        badge: "Great value",
      },
    ],
  },
  "New York": {
    city: "New York",
    country: "USA",
    code: "JFK",
    flag: "🇺🇸",
    badge: "100% on time",
    flights: [
      {
        id: "nyc-1",
        flightNumber: "DL-055",
        airline: "Delta Air Lines",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "New York",
        destinationCountry: "USA",
        destinationCode: "JFK",
        depTime: "09:00 AM",
        arrTime: "05:30 PM",
        arrNotice: "same day",
        duration: "13h 30m",
        stops: "Non-stop",
        price: 1275000,
        badge: "100% on time",
      },
      {
        id: "nyc-2",
        flightNumber: "UA-612",
        airline: "United Airlines",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "New York",
        destinationCountry: "USA",
        destinationCode: "JFK",
        depTime: "02:30 PM",
        arrTime: "11:15 PM",
        arrNotice: "same day",
        duration: "13h 45m",
        stops: "1 Stop (IAD)",
        price: 1230000,
        badge: "Best price",
      },
      {
        id: "nyc-3",
        flightNumber: "EK-201",
        airline: "Emirates",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "New York",
        destinationCountry: "USA",
        destinationCode: "JFK",
        depTime: "11:00 PM",
        arrTime: "07:30 AM",
        arrNotice: "+1 day",
        duration: "14h 30m",
        stops: "1 Stop (DXB)",
        price: 1335000,
        badge: "Premium",
      },
    ],
  },
  Dubai: {
    city: "Dubai",
    country: "UAE",
    code: "DXB",
    flag: "🇦🇪",
    badge: "100% on time",
    flights: [
      {
        id: "dxb-1",
        flightNumber: "EK-784",
        airline: "Emirates",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Dubai",
        destinationCountry: "UAE",
        destinationCode: "DXB",
        depTime: "11:00 AM",
        arrTime: "09:45 PM",
        arrNotice: "same day",
        duration: "7h 45m",
        stops: "Non-stop",
        price: 780000,
        badge: "100% on time",
      },
      {
        id: "dxb-2",
        flightNumber: "QR-1406",
        airline: "Qatar Airways",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Dubai",
        destinationCountry: "UAE",
        destinationCode: "DXB",
        depTime: "06:30 PM",
        arrTime: "05:15 AM",
        arrNotice: "+1 day",
        duration: "7h 45m",
        stops: "1 Stop (DOH)",
        price: 735000,
        badge: "Popular",
      },
      {
        id: "dxb-3",
        flightNumber: "FZ-802",
        airline: "flydubai",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Dubai",
        destinationCountry: "UAE",
        destinationCode: "DXB",
        depTime: "01:30 AM",
        arrTime: "12:15 PM",
        arrNotice: "same day",
        duration: "7h 45m",
        stops: "Non-stop",
        price: 690000,
        badge: "Budget friendly",
      },
    ],
  },
  Paris: {
    city: "Paris",
    country: "France",
    code: "CDG",
    flag: "🇫🇷",
    badge: "100% on time",
    flights: [
      {
        id: "par-1",
        flightNumber: "AF-522",
        airline: "Air France",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Paris",
        destinationCountry: "France",
        destinationCode: "CDG",
        depTime: "08:15 AM",
        arrTime: "03:30 PM",
        arrNotice: "same day",
        duration: "6h 15m",
        stops: "Non-stop",
        price: 1110000,
        badge: "100% on time",
      },
      {
        id: "par-2",
        flightNumber: "LH-568",
        airline: "Lufthansa",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Paris",
        destinationCountry: "France",
        destinationCode: "CDG",
        depTime: "01:45 PM",
        arrTime: "09:00 PM",
        arrNotice: "same day",
        duration: "6h 15m",
        stops: "1 Stop (FRA)",
        price: 1035000,
        badge: "Fastest",
      },
      {
        id: "par-3",
        flightNumber: "KL-588",
        airline: "KLM",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Paris",
        destinationCountry: "France",
        destinationCode: "CDG",
        depTime: "11:15 PM",
        arrTime: "06:30 AM",
        arrNotice: "+1 day",
        duration: "6h 15m",
        stops: "1 Stop (AMS)",
        price: 1065000,
        badge: "Overnight",
      },
    ],
  },
  Tokyo: {
    city: "Tokyo",
    country: "Japan",
    code: "HND",
    flag: "🇯🇵",
    badge: "100% on time",
    flights: [
      {
        id: "tyo-1",
        flightNumber: "NH-882",
        airline: "ANA (All Nippon Airways)",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Tokyo",
        destinationCountry: "Japan",
        destinationCode: "HND",
        depTime: "07:30 AM",
        arrTime: "12:15 PM",
        arrNotice: "+1 day",
        duration: "20h 45m",
        stops: "1 Stop (DOH)",
        price: 1725000,
        badge: "100% on time",
      },
      {
        id: "tyo-2",
        flightNumber: "QR-806",
        airline: "Qatar Airways",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Tokyo",
        destinationCountry: "Japan",
        destinationCode: "HND",
        depTime: "02:00 PM",
        arrTime: "07:30 PM",
        arrNotice: "+1 day",
        duration: "21h 30m",
        stops: "1 Stop (DOH)",
        price: 1620000,
        badge: "Best price",
      },
      {
        id: "tyo-3",
        flightNumber: "EK-318",
        airline: "Emirates",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Tokyo",
        destinationCountry: "Japan",
        destinationCode: "HND",
        depTime: "09:00 PM",
        arrTime: "02:45 AM",
        arrNotice: "+2 days",
        duration: "21h 45m",
        stops: "1 Stop (DXB)",
        price: 1680000,
        badge: "Top comfort",
      },
    ],
  },
  Rome: {
    city: "Rome",
    country: "Italy",
    code: "FCO",
    flag: "🇮🇹",
    badge: "100% on time",
    flights: [
      {
        id: "rom-1",
        flightNumber: "AZ-892",
        airline: "ITA Airways",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Rome",
        destinationCountry: "Italy",
        destinationCode: "FCO",
        depTime: "09:30 AM",
        arrTime: "04:45 PM",
        arrNotice: "same day",
        duration: "6h 15m",
        stops: "1 Stop (CDG)",
        price: 990000,
        badge: "100% on time",
      },
      {
        id: "rom-2",
        flightNumber: "TK-625",
        airline: "Turkish Airlines",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Rome",
        destinationCountry: "Italy",
        destinationCode: "FCO",
        depTime: "02:15 PM",
        arrTime: "09:30 PM",
        arrNotice: "same day",
        duration: "6h 15m",
        stops: "1 Stop (IST)",
        price: 930000,
        badge: "Best rate",
      },
      {
        id: "rom-3",
        flightNumber: "KL-588",
        airline: "KLM",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Rome",
        destinationCountry: "Italy",
        destinationCode: "FCO",
        depTime: "10:30 PM",
        arrTime: "05:45 AM",
        arrNotice: "+1 day",
        duration: "6h 15m",
        stops: "1 Stop (AMS)",
        price: 960000,
        badge: "Overnight",
      },
    ],
  },
  Barcelona: {
    city: "Barcelona",
    country: "Spain",
    code: "BCN",
    flag: "🇪🇸",
    badge: "100% on time",
    flights: [
      {
        id: "bcn-1",
        flightNumber: "IB-312",
        airline: "Iberia",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Barcelona",
        destinationCountry: "Spain",
        destinationCode: "BCN",
        depTime: "08:45 AM",
        arrTime: "04:30 PM",
        arrNotice: "same day",
        duration: "6h 45m",
        stops: "1 Stop (MAD)",
        price: 1005000,
        badge: "100% on time",
      },
      {
        id: "bcn-2",
        flightNumber: "AF-620",
        airline: "Air France",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Barcelona",
        destinationCountry: "Spain",
        destinationCode: "BCN",
        depTime: "01:30 PM",
        arrTime: "09:15 PM",
        arrNotice: "same day",
        duration: "6h 45m",
        stops: "1 Stop (CDG)",
        price: 960000,
        badge: "Best price",
      },
      {
        id: "bcn-3",
        flightNumber: "LH-842",
        airline: "Lufthansa",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Barcelona",
        destinationCountry: "Spain",
        destinationCode: "BCN",
        depTime: "11:00 PM",
        arrTime: "06:45 AM",
        arrNotice: "+1 day",
        duration: "6h 45m",
        stops: "1 Stop (FRA)",
        price: 990000,
        badge: "Overnight",
      },
    ],
  },
  Santorini: {
    city: "Santorini",
    country: "Greece",
    code: "JTR",
    flag: "🇬🇷",
    badge: "100% on time",
    flights: [
      {
        id: "jtr-1",
        flightNumber: "A3-912",
        airline: "Aegean Airlines",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Santorini",
        destinationCountry: "Greece",
        destinationCode: "JTR",
        depTime: "07:15 AM",
        arrTime: "05:45 PM",
        arrNotice: "same day",
        duration: "9h 30m",
        stops: "1 Stop (ATH)",
        price: 1080000,
        badge: "100% on time",
      },
      {
        id: "jtr-2",
        flightNumber: "TK-784",
        airline: "Turkish Airlines",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Santorini",
        destinationCountry: "Greece",
        destinationCode: "JTR",
        depTime: "12:45 PM",
        arrTime: "11:15 PM",
        arrNotice: "same day",
        duration: "9h 30m",
        stops: "1 Stop (IST)",
        price: 1035000,
        badge: "Best price",
      },
      {
        id: "jtr-3",
        flightNumber: "QR-490",
        airline: "Qatar Airways",
        originCity: "Lagos",
        originCountry: "Nigeria",
        originCode: "LOS",
        destinationCity: "Santorini",
        destinationCountry: "Greece",
        destinationCode: "JTR",
        depTime: "09:30 PM",
        arrTime: "08:00 AM",
        arrNotice: "+1 day",
        duration: "9h 30m",
        stops: "1 Stop (DOH)",
        price: 1125000,
        badge: "Luxury choice",
      },
    ],
  },
};

// State
let currentDestinationKey = "Sydney";
let selectedFlightData = null;
let currentFlightClass = window.FlightClass ? FlightClass.getSelected() : "Economy";

// Error Toast Utility
function showError(msg) {
  const existing = document.getElementById("custom-error-toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.id = "custom-error-toast";
  toast.style.cssText =
    "position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#f44336;color:white;padding:12px 24px;border-radius:8px;font-family:sans-serif;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:9999;display:flex;align-items:center;gap:12px;opacity:0;transition:opacity 0.3s;";
  toast.innerHTML = `<span>${msg.replace(/\n/g, "<br>")}</span><button style="background:none;border:none;color:white;font-weight:bold;cursor:pointer;padding:0;font-size:16px;">&times;</button>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => (toast.style.opacity = "1"));
  toast.querySelector("button").onclick = () => {
    toast.style.opacity = "0";
    setTimeout(() => {
      if (document.body.contains(toast)) toast.remove();
    }, 300);
  };
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(toast)) toast.remove();
      }, 300);
    }
  }, 4000);
}

// Find closest matching key in catalog
function resolveDestinationKey(rawName) {
  if (!rawName) return "Sydney";
  const search = rawName.trim().toLowerCase();

  for (const key of Object.keys(FLIGHT_CATALOG)) {
    if (key.toLowerCase() === search) return key;
    if (FLIGHT_CATALOG[key].city.toLowerCase() === search) return key;
    if (FLIGHT_CATALOG[key].country.toLowerCase() === search) return key;
  }

  // Alias checks
  if (search.includes("syd") || search.includes("austr")) return "Sydney";
  if (search.includes("toronto") || search.includes("canada") || search.includes("tront")) return "Toronto";
  if (search.includes("london") || search.includes("uk") || search.includes("britain")) return "London";
  if (search.includes("new york") || search.includes("usa") || search.includes("nyc") || search.includes("america")) return "New York";
  if (search.includes("dubai") || search.includes("uae") || search.includes("emirates")) return "Dubai";
  if (search.includes("tokyo") || search.includes("japan")) return "Tokyo";
  if (search.includes("paris") || search.includes("france")) return "Paris";
  if (search.includes("rome") || search.includes("ital")) return "Rome";
  if (search.includes("barcelona") || search.includes("spain")) return "Barcelona";
  if (search.includes("santorini") || search.includes("greece")) return "Santorini";

  return "Sydney";
}

// Render Destination Pills Switcher
function renderDestinationPills() {
  const container = document.getElementById("dest-pills");
  if (!container) return;

  container.innerHTML = "";
  const keys = Object.keys(FLIGHT_CATALOG);

  keys.forEach((key) => {
    const item = FLIGHT_CATALOG[key];
    const pill = document.createElement("button");
    pill.className = `dest-pill ${key === currentDestinationKey ? "active" : ""}`;
    pill.type = "button";
    pill.innerHTML = `<span class="pill-flag">${item.flag || "✈️"}</span> <span class="pill-name">${item.city}</span>`;

    pill.addEventListener("click", () => {
      if (currentDestinationKey !== key) {
        setDestination(key);
      }
    });

    container.appendChild(pill);
  });
}

// Set active destination and refresh views
function setDestination(destKey) {
  currentDestinationKey = resolveDestinationKey(destKey);
  const destData = FLIGHT_CATALOG[currentDestinationKey];

  // Update Route Banner Header
  const destCityEl = document.getElementById("dest-city");
  const destCountryEl = document.getElementById("dest-country");
  const routeBadgeEl = document.getElementById("route-badge");
  const activeDestTextEl = document.getElementById("active-dest-text");

  if (destCityEl) destCityEl.textContent = destData.city;
  if (destCountryEl) destCountryEl.textContent = destData.country;
  if (routeBadgeEl) routeBadgeEl.textContent = destData.badge || "100% on time";
  if (activeDestTextEl) activeDestTextEl.textContent = `${destData.city}, ${destData.country}`;

  // Update localStorage with selected city and country
  localStorage.setItem("selectedDestinationCity", destData.city);
  localStorage.setItem("selectedDestinationCountry", destData.country);

  // Update pills UI
  const pills = document.querySelectorAll(".dest-pill");
  pills.forEach((p) => {
    const isThis = p.textContent.includes(destData.city);
    p.classList.toggle("active", isThis);
  });

  // Render the destination flight cards
  renderFlightCards(destData);
}

// Render dynamic flight cards
function renderFlightCards(destData) {
  const listEl = document.getElementById("flights-list");
  if (!listEl) return;

  listEl.innerHTML = "";
  const flights = destData.flights || [];

  if (flights.length === 0) {
    listEl.innerHTML = `
      <div class="empty-flights">
        <p>No flights currently scheduled for this route. Please pick another destination.</p>
      </div>`;
    selectedFlightData = null;
    return;
  }

  // Keep the previously selected flight highlighted when re-rendering (e.g. class switch)
  const previouslySelectedId = selectedFlightData ? selectedFlightData.id : null;
  const keepIndex = flights.findIndex((f) => f.id === previouslySelectedId);
  const defaultIndex = keepIndex >= 0 ? keepIndex : 0;

  const isBusiness = currentFlightClass === "Business";
  const otherClass = isBusiness ? "Economy" : "Business";

  flights.forEach((flight, index) => {
    const card = document.createElement("div");
    const isSelected = index === defaultIndex;
    card.className = `flight-card ${isSelected ? "selected" : ""} ${isBusiness ? "is-business" : ""}`;
    card.dataset.flightId = flight.id;

    const classPrice = FlightClass.priceFor(flight.price, currentFlightClass);
    const otherPrice = FlightClass.priceFor(flight.price, otherClass);

    card.innerHTML = `
      <div class="flight-top-bar">
        <span class="flight-airline-pill">${flight.airline} &bull; ${flight.flightNumber}</span>
        <span class="flight-class-pill ${isBusiness ? "business" : "economy"}">${currentFlightClass}</span>
        <span class="flight-stops-pill">${flight.stops}</span>
      </div>

      <div class="flight-header">
        <div class="flight-location">
          <div class="flight-city">${flight.originCity}</div>
          <div class="flight-country">${flight.originCountry}</div>
        </div>

        <div class="flight-center">
          <div class="flight-badge">${flight.badge || "100% on time"}</div>
          <div class="flight-duration">${flight.duration}</div>
        </div>

        <div class="flight-location" style="text-align: right;">
          <div class="flight-city">${flight.destinationCity}</div>
          <div class="flight-country">${flight.destinationCountry}</div>
        </div>
      </div>

      <div class="flight-times">
        <div class="flight-time">
          <div class="time">${flight.depTime}</div>
          <div class="time-location">${flight.originCountry}</div>
        </div>

        <div class="flight-price-tag">
          <span class="price-val">${FlightClass.formatNaira(classPrice)}</span>
          <span class="price-sub">${currentFlightClass} / seat</span>
          <span class="price-alt">${otherClass}: ${FlightClass.formatNaira(otherPrice)}</span>
        </div>

        <div class="flight-time" style="text-align: right;">
          <div class="time">${flight.arrTime} <small class="time-extra">${flight.arrNotice || ""}</small></div>
          <div class="time-location">${flight.destinationCountry}</div>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      document.querySelectorAll(".flight-card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedFlightData = flight;
    });

    listEl.appendChild(card);
  });

  // Default select (previously chosen flight, else first)
  selectedFlightData = flights[defaultIndex];
}

// Switch cabin class and refresh prices
function setFlightClass(cls) {
  currentFlightClass = FlightClass.setSelected(cls);

  document.querySelectorAll(".class-option").forEach((btn) => {
    const active = btn.dataset.class === currentFlightClass;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });

  const activeClassText = document.getElementById("active-class-text");
  if (activeClassText) {
    const mult = FlightClass.info(currentFlightClass).multiplier;
    activeClassText.textContent = mult === 1 ? currentFlightClass : `${currentFlightClass} (${mult}× Economy fare)`;
  }

  renderFlightCards(FLIGHT_CATALOG[currentDestinationKey]);
}

// Continue Button click handler
function continueFlight() {
  if (!selectedFlightData) {
    showError("Please select a flight to proceed!");
    return;
  }

  // Persist full flight object (with cabin class + class-adjusted fare) to localStorage
  const classPrice = FlightClass.priceFor(selectedFlightData.price, currentFlightClass);
  const chosen = {
    ...selectedFlightData,
    basePrice: selectedFlightData.price, // Economy fare
    price: classPrice, // fare for chosen class
    flightClass: currentFlightClass,
  };

  localStorage.setItem("chosenFlight", JSON.stringify(chosen));
  localStorage.setItem("bookingLocation", `${chosen.destinationCountry}, ${chosen.destinationCity}`);
  localStorage.setItem("bookingAirline", chosen.airline);
  localStorage.setItem("selectedFlightPrice", classPrice);
  localStorage.setItem("selectedFlightClass", currentFlightClass);

  console.log("Chosen flight:", chosen);
  window.location.href = "../../booking/date-picker/datepicker.html";
}

// Back to Home
function goBack() {
  window.location.href = "../../booking/home/home.html";
}

// Initialization on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Read destination from URL parameters first (?to=Sydney&country=Australia)
  const urlParams = new URLSearchParams(window.location.search);
  const toParam = urlParams.get("to");
  const storedCity = localStorage.getItem("selectedDestinationCity");

  const initialDest = toParam || storedCity || "Sydney";
  const resolvedKey = resolveDestinationKey(initialDest);

  // Cabin class from URL (?class=Business) or storage
  const classParam = urlParams.get("class");
  if (classParam) currentFlightClass = FlightClass.setSelected(classParam);

  document.querySelectorAll(".class-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.class !== currentFlightClass) setFlightClass(btn.dataset.class);
    });
  });

  renderDestinationPills();
  setDestination(resolvedKey);
  setFlightClass(currentFlightClass);

  // Smooth entrance
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.3s ease";
    document.body.style.opacity = "1";
  }, 80);
});
