document.addEventListener("DOMContentLoaded", () => {
  const seats = document.querySelectorAll(".seat.available, .seat.selected");
  const backBtn = document.getElementById("back-btn");
  const continueBtn = document.getElementById("continue-btn");

  const SEAT_PRICE = 1000;
  let selectedSeats = [];

  // Seat selection
  seats.forEach((seat) => {
    seat.addEventListener("click", function () {
      if (this.classList.contains("booked")) return;

      const seatNumber = this.dataset.seat;

      if (this.classList.contains("selected")) {
        this.classList.remove("selected");
        this.classList.add("available");
        selectedSeats = selectedSeats.filter((s) => s !== seatNumber);
      } else {
        this.classList.remove("available");
        this.classList.add("selected");
        selectedSeats.push(seatNumber);
      }

      // Calculate price
      const totalPrice = selectedSeats.length * SEAT_PRICE;

      console.log("Seats:", selectedSeats);
      console.log("Total price: $" + totalPrice);
    });
  });

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
        alert("Please select at least one seat");
        return;
      }

      const totalPrice = selectedSeats.length * SEAT_PRICE;

      // SAVE TO STORAGE
      localStorage.setItem("bookingSeats", JSON.stringify(selectedSeats));
      localStorage.setItem("totalPrice", totalPrice);

      window.location.href = "../../booking/booking-details/bookings.html";
    });
  }
});
