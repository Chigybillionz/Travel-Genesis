document.addEventListener("DOMContentLoaded", function () {
  // Return to home functionality
  const returnHome = document.getElementById("return-button") || document.querySelector(".return-button");
  if (returnHome && returnHome.tagName === "BUTTON") {
    returnHome.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "../../booking/home/home.html";
    });
  }

  // Load all ticket data
  loadUserData();
  loadFlightData();
  loadSelectedSeats();
  loadFlightDate();
});

// Function to load chosen flight details & sidebar summary
function loadFlightData() {
  let flight = null;
  const chosenFlightRaw = localStorage.getItem("chosenFlight");
  if (chosenFlightRaw) {
    try {
      flight = JSON.parse(chosenFlightRaw);
    } catch (e) {
      console.error(e);
    }
  }

  if (!flight) {
    const lastBookingRaw = localStorage.getItem("lastBooking");
    if (lastBookingRaw) {
      try {
        const lastBooking = JSON.parse(lastBookingRaw);
        flight = lastBooking.flight || lastBooking;
      } catch (e) {
        console.error(e);
      }
    }
  }

  // Ticket card elements
  const originCityEl = document.getElementById("ticket-origin-city");
  const originCountryEl = document.getElementById("ticket-origin-country");
  const destCityEl = document.getElementById("ticket-dest-city");
  const destCountryEl = document.getElementById("ticket-dest-country");
  const durationEl = document.getElementById("ticket-duration");
  const depTimeEl = document.getElementById("ticket-dep-time");
  const depCountryEl = document.getElementById("ticket-dep-country");
  const arrTimeEl = document.getElementById("ticket-arr-time");
  const arrCountryEl = document.getElementById("ticket-arr-country");
  const airlineEl = document.getElementById("ticket-airline-name");
  const flightIdEl = document.getElementById("ticket-flight-id");
  const flightClassEl = document.getElementById("ticket-class");
  const gateEl = document.getElementById("ticket-gate");

  // Sidebar elements
  const sideRouteEl = document.getElementById("sidebar-route");
  const sideAirlineEl = document.getElementById("sidebar-airline");
  const sideDepEl = document.getElementById("sidebar-dep");
  const sideArrEl = document.getElementById("sidebar-arr");
  const sideClassEl = document.getElementById("sidebar-class");

  if (flight) {
    const origCity = flight.originCity || (flight.origin && flight.origin.city) || "Lagos";
    const origCountry = flight.originCountry || "Nigeria";
    const destCity = flight.destinationCity || (flight.destination && flight.destination.city) || "London";
    const destCountry = flight.destinationCountry || "UK";
    const depTime = flight.depTime || flight.departureTime || "7:00 AM";
    const arrTime = flight.arrTime || flight.arrivalTime || "7:30 PM";
    const airlineName = flight.airline || "British Airways";
    const flightNum = flight.flightNumber || flight.id || "BA-2490";
    const duration = flight.duration || "1h 30m";
    const flightClass = flight.flightClass || flight.class || "Economy";
    const gate = flight.gate || "23 C";

    if (originCityEl) originCityEl.textContent = origCity;
    if (originCountryEl) originCountryEl.textContent = origCountry;
    if (destCityEl) destCityEl.textContent = destCity;
    if (destCountryEl) destCountryEl.textContent = destCountry;
    if (durationEl) durationEl.textContent = duration;
    if (depTimeEl) depTimeEl.textContent = depTime;
    if (depCountryEl) depCountryEl.textContent = origCountry;
    if (arrTimeEl) arrTimeEl.textContent = arrTime;
    if (arrCountryEl) arrCountryEl.textContent = destCountry;
    if (airlineEl) airlineEl.textContent = flight.flightNumber ? `${airlineName} (${flight.flightNumber})` : airlineName;
    if (flightIdEl) flightIdEl.textContent = flightNum;
    if (flightClassEl) flightClassEl.textContent = flightClass;
    if (gateEl) gateEl.textContent = gate;

    // Sidebar
    if (sideRouteEl) sideRouteEl.textContent = `${origCity} → ${destCity}`;
    if (sideAirlineEl) sideAirlineEl.textContent = airlineName;
    if (sideDepEl) sideDepEl.textContent = depTime;
    if (sideArrEl) sideArrEl.textContent = arrTime;
    if (sideClassEl) sideClassEl.textContent = flightClass;
  }
}

// Function to load user profile data from localStorage
function loadUserData() {
  const userFullName = localStorage.getItem("userFullName") || localStorage.getItem("userName") || "Naomi Davies";
  const passEl = document.getElementById("ticket-passenger") || document.getElementById("passengerName");
  if (passEl) {
    passEl.textContent = userFullName;
  }
}

// Function to load selected seats from localStorage
function loadSelectedSeats() {
  const savedSeats = localStorage.getItem("bookingSeats");
  let seatDisplay = "A4 & B6";

  if (savedSeats) {
    try {
      const seatsArray = JSON.parse(savedSeats);
      if (Array.isArray(seatsArray) && seatsArray.length > 0) {
        seatDisplay = seatsArray.join(" & ");
      }
    } catch (e) {
      if (typeof savedSeats === "string" && savedSeats.trim()) {
        seatDisplay = savedSeats;
      }
    }
  }

  const seatEl = document.getElementById("ticket-seats") || document.getElementById("passengerSeat");
  if (seatEl) {
    seatEl.textContent = seatDisplay;
  }
}

// Function to load flight date from localStorage
function loadFlightDate() {
  const savedDate = localStorage.getItem("bookingDate");
  const dateEl = document.getElementById("ticket-date") || document.querySelector(".detail-value");
  if (dateEl) {
    if (savedDate && savedDate.trim() && savedDate !== "No date selected") {
      dateEl.textContent = formatDate(savedDate);
    } else {
      dateEl.textContent = "17-10-2026";
    }
  }
}

// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return "17-10-2026";
  if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) return dateString;

  const months = {
    january: "01", february: "02", march: "03", april: "04",
    may: "05", june: "06", july: "07", august: "08",
    september: "09", october: "10", november: "11", december: "12",
    jan: "01", feb: "02", mar: "03", apr: "04", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12"
  };

  try {
    const clean = dateString.replace(/,/g, "").trim();
    const parts = clean.split(" ");
    if (parts.length >= 3) {
      let day = parts[0];
      let month = parts[1];
      let year = parts[2];
      if (isNaN(day) && !isNaN(parts[1])) {
        // e.g. "Wed 03 Dec 2025"
        day = parts[1];
        month = parts[2];
        year = parts[3];
      }
      day = String(day).padStart(2, "0");
      const mNum = months[month.toLowerCase()] || "10";
      return `${day}-${mNum}-${year}`;
    }
  } catch (e) {
    console.error("Error formatting date:", e);
  }
  return dateString;
}
