function showError(msg) {
  const existing = document.getElementById('custom-error-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'custom-error-toast';
  toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#f44336;color:white;padding:12px 24px;border-radius:8px;font-family:sans-serif;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:9999;display:flex;align-items:center;gap:12px;opacity:0;transition:opacity 0.3s;';
  toast.innerHTML = `<span>${msg.replace(/\n/g, '<br>')}</span><button style="background:none;border:none;color:white;font-weight:bold;cursor:pointer;padding:0;font-size:16px;">&times;</button>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.style.opacity = '1');
  toast.querySelector('button').onclick = () => {
    toast.style.opacity = '0';
    setTimeout(() => { if (document.body.contains(toast)) toast.remove(); }, 300);
  };
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.style.opacity = '0';
      setTimeout(() => { if (document.body.contains(toast)) toast.remove(); }, 300);
    }
  }, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  const seats = document.querySelectorAll(".seat");
  const backBtn = document.getElementById("back-btn");
  const continueBtn = document.getElementById("continue-btn");
  const selectedSeatsDisplay = document.getElementById("selected-seats-display");
  const totalPriceDisplay = document.getElementById("total-price-display");
  const routeInfoDisplay = document.getElementById("flight-route-info");

  // Read route info and price from storage
  let chosenFlight = {};
  try {
    chosenFlight = JSON.parse(localStorage.getItem("chosenFlight") || "{}");
  } catch (e) {
    chosenFlight = {};
  }

  // Prices are in Naira (NGN). Values under 10,000 are legacy USD from older sessions, so convert them.
  let SEAT_PRICE = Number(localStorage.getItem("selectedFlightPrice")) || Number(chosenFlight.price) || 1050000;
  if (SEAT_PRICE < 10000) SEAT_PRICE = SEAT_PRICE * 1500;

  const flightClass = chosenFlight.flightClass || localStorage.getItem("selectedFlightClass") || "Economy";

  if (routeInfoDisplay && chosenFlight.originCity && chosenFlight.destinationCity) {
    routeInfoDisplay.textContent = `${chosenFlight.originCity} (${chosenFlight.originCode || "LOS"}) ➔ ${chosenFlight.destinationCity} (${chosenFlight.destinationCode || "DEST"}) • ${chosenFlight.airline || "Flight"} • ${flightClass} ₦${SEAT_PRICE.toLocaleString()}/seat`;
  }

  // Pre-selected seats from DOM or storage
  let selectedSeats = [];
  const initialSelected = document.querySelectorAll(".seat.selected");
  initialSelected.forEach((s) => {
    if (s.dataset.seat) selectedSeats.push(s.dataset.seat);
  });

  updateSelectionSummary();

  // Seat click handler
  seats.forEach((seat) => {
    seat.addEventListener("click", function () {
      if (this.classList.contains("booked") || this.disabled) return;

      const seatNumber = this.dataset.seat;

      if (this.classList.contains("selected")) {
        this.classList.remove("selected");
        this.classList.add("available");
        selectedSeats = selectedSeats.filter((s) => s !== seatNumber);
      } else {
        this.classList.remove("available");
        this.classList.add("selected");
        if (!selectedSeats.includes(seatNumber)) {
          selectedSeats.push(seatNumber);
        }
      }

      updateSelectionSummary();
    });
  });

  function updateSelectionSummary() {
    const totalPrice = selectedSeats.length * SEAT_PRICE;

    if (selectedSeatsDisplay) {
      selectedSeatsDisplay.textContent = selectedSeats.length > 0 ? selectedSeats.join(", ") : "None selected";
    }

    if (totalPriceDisplay) {
      totalPriceDisplay.textContent = `₦${totalPrice.toLocaleString()}`;
    }
  }

  // Back button
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "../../booking/date-picker/datepicker.html";
    });
  }

  // Continue button
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      if (selectedSeats.length === 0) {
        showError("Please select at least one seat to proceed");
        return;
      }

      const totalPrice = selectedSeats.length * SEAT_PRICE;

      // SAVE TO STORAGE
      localStorage.setItem("bookingSeats", JSON.stringify(selectedSeats));
      localStorage.setItem("totalPrice", totalPrice);

      window.location.href = "../../booking/booking-details/bookings.html";
    });
  }

  // Seat Toggle Logic
  const seatRows = document.querySelectorAll(".seat-row");
  const toggleFront = document.getElementById("toggle-front");
  const toggleBack = document.getElementById("toggle-back");

  let currentSection = 'front'; // 'front' or 'back'

  function updateSeatDisplay() {
    seatRows.forEach((row, index) => {
      // Assuming 10 rows total: 0-4 are front, 5-9 are back
      if (currentSection === 'front') {
        row.style.display = index < 5 ? "grid" : "none";
      } else {
        row.style.display = index >= 5 ? "grid" : "none";
      }
    });

    if (toggleFront && toggleBack) {
      if (currentSection === 'front') {
        toggleFront.classList.add('active');
        toggleBack.classList.remove('active');
      } else {
        toggleFront.classList.remove('active');
        toggleBack.classList.add('active');
      }
    }
  }

  if (toggleFront) {
    toggleFront.addEventListener("click", () => {
      currentSection = 'front';
      updateSeatDisplay();
    });
  }

  if (toggleBack) {
    toggleBack.addEventListener("click", () => {
      currentSection = 'back';
      updateSeatDisplay();
    });
  }

  updateSeatDisplay();
});
