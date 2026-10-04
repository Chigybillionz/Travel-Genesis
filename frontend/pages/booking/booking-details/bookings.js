//  Add functionality to edit buttons
document.querySelectorAll(".edit-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const item = this.closest(".detail-item");
    const label = item.querySelector(".detail-label").textContent;
  });
});

// Back button functionality
document.querySelector(".back-btn").addEventListener("click", function () {});

// Continue button functionality
document
  .querySelector(".continue-btn")
  .addEventListener("click", function () {});

///when the booking back is clicked

document.addEventListener("DOMContentLoaded", () => {
  const bookingbackbtn = document.getElementById("back-btn");

  if (bookingbackbtn) {
    bookingbackbtn.addEventListener("click", () => {
      window.location.href = "../../booking/seat-selection/seat.html";
    });
  }
});

///when the continue is beeng is clicked

document.addEventListener("DOMContentLoaded", () => {
  const continuebtn = document.getElementById("continue-btn");

  // Back button - navigate to previous page
  if (continuebtn) {
    continuebtn.addEventListener("click", () => {
      window.location.href = "../../payment/checkout/payment.html";
    });
  }
});

// for the edit  date
document.addEventListener("DOMContentLoaded", function () {
  const editdate = document.getElementById("edit-date");
  if (editdate) {
    editdate.addEventListener("click", function () {
      console.log("returning to splash page...");

      window.location.href = "../../booking/date-picker/datepicker.html";
    });
  }
});

//for the loaction edit

document.addEventListener("DOMContentLoaded", function () {
  const editloaction = document.getElementById("edit-loacation");
  if (editloaction) {
    editloaction.addEventListener("click", function () {
      console.log("returning to splash page...");

      window.location.href = "../../booking/flight-details/flight.html";
    });
  }
});

//for the seat edit

document.addEventListener("DOMContentLoaded", function () {
  const editseat = document.getElementById("edit-seat");
  if (editseat) {
    editseat.addEventListener("click", function () {
      console.log("returning to splash page...");

      window.location.href = "../../booking/seat-selection/seat.html";
    });
  }
});

// to save the date selected
document.addEventListener("DOMContentLoaded", () => {
  const bookingDateEl = document.getElementById("booking-date");

  // Get date from localStorage
  const savedDate = localStorage.getItem("bookingDate");

  if (savedDate) {
    bookingDateEl.textContent = savedDate;
  } else {
    bookingDateEl.textContent = "No date selected";
  }
});
//  to save the seats selected
const bookingSeatsEl = document.getElementById("booking-seats");
const savedSeats = JSON.parse(localStorage.getItem("bookingSeats"));

if (savedSeats && savedSeats.length > 0) {
  bookingSeatsEl.textContent = savedSeats.join(" & ");
} else {
  bookingSeatsEl.textContent = "No seat selected";
}

// Load location and airline from chosen flight
document.addEventListener("DOMContentLoaded", () => {
  const locationEl = document.getElementById("booking-location");
  const airlineEl = document.getElementById("booking-airline");
  const chosenFlightRaw = localStorage.getItem("chosenFlight");
  const savedLocation = localStorage.getItem("bookingLocation");
  const savedAirline = localStorage.getItem("bookingAirline");

  if (chosenFlightRaw) {
    try {
      const flight = JSON.parse(chosenFlightRaw);
      if (locationEl) {
        locationEl.textContent = `${flight.destinationCountry}, ${flight.destinationCity}`;
      }
      if (airlineEl) {
        airlineEl.textContent = flight.airline || "British Airways";
      }
    } catch (e) {
      console.error("Error parsing chosenFlight:", e);
    }
  } else {
    if (savedLocation && locationEl) locationEl.textContent = savedLocation;
    if (savedAirline && airlineEl) airlineEl.textContent = savedAirline;
  }
});

// Load total price
const totalPriceEl = document.getElementById("total-price");
const savedPrice = localStorage.getItem("totalPrice");

if (savedPrice) {
  totalPriceEl.textContent = `₦${Number(savedPrice).toLocaleString()}`;
} else {
  totalPriceEl.textContent = "₦0";
}
