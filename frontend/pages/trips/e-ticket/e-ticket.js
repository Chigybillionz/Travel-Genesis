document.addEventListener("DOMContentLoaded", function () {
  // Return to home functionality
  const retrunhome = document.getElementById("return-button");
  if (retrunhome) {
    retrunhome.addEventListener("click", function () {
      console.log("returning to home page...");
      window.location.href = "../../booking/home/home.html";
    });
  }

  // Load all user data
  loadUserData();
  loadSelectedSeats();
  loadFlightDate();
  loadChosenFlight();
});

// Function to load chosen flight details (destination, times, airline)
function loadChosenFlight() {
  const chosenFlightRaw = localStorage.getItem("chosenFlight");
  if (!chosenFlightRaw) return;

  try {
    const flight = JSON.parse(chosenFlightRaw);
    console.log("✈️ Loading chosen flight on e-ticket:", flight);

    const destCityEl = document.getElementById("ticket-dest-city");
    const destCountryEl = document.getElementById("ticket-dest-country");
    const depTimeEl = document.getElementById("ticket-dep-time");
    const arrTimeEl = document.getElementById("ticket-arr-time");
    const arrCountryEl = document.getElementById("ticket-arr-country");
    const airlineEl = document.getElementById("ticket-airline-name");

    if (destCityEl && flight.destinationCity) destCityEl.textContent = flight.destinationCity;
    if (destCountryEl && flight.destinationCountry) destCountryEl.textContent = flight.destinationCountry;
    if (depTimeEl && flight.depTime) depTimeEl.textContent = flight.depTime;
    if (arrTimeEl && flight.arrTime) arrTimeEl.textContent = flight.arrTime;
    if (arrCountryEl && flight.destinationCountry) arrCountryEl.textContent = flight.destinationCountry;
    if (airlineEl && flight.airline) airlineEl.textContent = `${flight.airline} (${flight.flightNumber || ""})`;
  } catch (e) {
    console.error("Error loading chosen flight on e-ticket:", e);
  }
}

// Function to load user profile data from localStorage
function loadUserData() {
  const userFullName = localStorage.getItem("userFullName");
  console.log("📋 Loading user data from localStorage:");
  console.log("Full Name:", userFullName);

  // Update passenger name
  const passengerNameElement = document.getElementById("passengerName");
  if (passengerNameElement) {
    if (userFullName && userFullName.trim() !== "") {
      passengerNameElement.textContent = userFullName;
      console.log("✅ Updated passenger name to:", userFullName);
    } else {
      passengerNameElement.textContent = "Naomi Davies"; // Default name
      console.log("⚠️ Using default name");
    }
  }
}

// Function to load selected seats from localStorage
function loadSelectedSeats() {
  const savedSeats = localStorage.getItem("bookingSeats");
  console.log("🎫 Loading seats from localStorage:");
  console.log("Saved Seats (raw):", savedSeats);

  // Update seat display
  const passengerSeatElement = document.getElementById("passengerSeat");
  if (passengerSeatElement) {
    if (savedSeats) {
      try {
        // Parse the JSON string
        const seatsArray = JSON.parse(savedSeats);
        console.log("Parsed Seats Array:", seatsArray);

        if (Array.isArray(seatsArray) && seatsArray.length > 0) {
          // Join seats with " & " separator
          const seatsText = seatsArray.join(" & ");
          passengerSeatElement.textContent = seatsText;
          console.log("✅ Updated seats to:", seatsText);
        } else {
          passengerSeatElement.textContent = "A4 & B6"; // Default seats
          console.log("⚠️ Empty seats array, using default");
        }
      } catch (error) {
        console.error("❌ Error parsing seats:", error);
        passengerSeatElement.textContent = "A4 & B6"; // Default seats
      }
    } else {
      passengerSeatElement.textContent = "A4 & B6"; // Default seats
      console.log("⚠️ No seats found in localStorage, using default");
    }
  } else {
    console.error("❌ Seat element not found!");
  }
}

// Function to load flight date from localStorage
function loadFlightDate() {
  const savedDate = localStorage.getItem("bookingDate");
  console.log("📅 Loading flight date from localStorage:");
  console.log("Saved Date (raw):", savedDate);

  // Find all detail-value elements
  const detailRows = document.querySelectorAll(".detail-row");

  // The date is in the first detail-row, second detail-item (right side)
  if (detailRows && detailRows.length > 0) {
    const firstRow = detailRows[0];
    const dateElement = firstRow.querySelectorAll(".detail-value")[1]; // Second value (right side)

    if (
      dateElement &&
      savedDate &&
      savedDate.trim() !== "" &&
      savedDate !== "No date selected"
    ) {
      // Format the date nicely (e.g., "3 December 2025" -> "03-12-2025")
      const formattedDate = formatDate(savedDate);
      dateElement.textContent = formattedDate;
      console.log("✅ Updated flight date to:", formattedDate);
    } else {
      dateElement.textContent = "03-12-2025"; // Default date
      console.log("⚠️ Using default date");
    }
  } else {
    console.error("❌ Date element not found!");
  }
}

// Helper function to format date from "3 December 2025" to "03-12-2025"
function formatDate(dateString) {
  if (!dateString) return "03-12-2025";

  // If already in DD-MM-YYYY format, return as is
  if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
    return dateString;
  }

  // Parse "3 December 2025" format
  const months = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };

  try {
    const parts = dateString.split(" ");
    if (parts.length === 3) {
      const day = parts[0].padStart(2, "0");
      const month = months[parts[1].toLowerCase()];
      const year = parts[2];

      if (month) {
        return `${day}-${month}-${year}`;
      }
    }
  } catch (error) {
    console.error("Error formatting date:", error);
  }

  // If parsing fails, return the original or default
  return dateString || "03-12-2025";
}
