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

  // Seat Pagination Logic
  const seatRows = document.querySelectorAll('.seat-row');
  const prevSeatsBtn = document.getElementById('prev-seats-btn');
  const nextSeatsBtn = document.getElementById('next-seats-btn');

  let currentSeatPage = 0;
  const rowsPerPage = 4;
  const totalPages = Math.ceil(seatRows.length / rowsPerPage);

  function updateSeatPagination() {
    seatRows.forEach((row, index) => {
      if (index >= currentSeatPage * rowsPerPage && index < (currentSeatPage + 1) * rowsPerPage) {
        row.style.display = 'grid'; // Because seat-row uses grid
      } else {
        row.style.display = 'none';
      }
    });

    if (prevSeatsBtn) {
      prevSeatsBtn.style.display = currentSeatPage === 0 ? 'none' : 'block';
    }
    if (nextSeatsBtn) {
      nextSeatsBtn.style.display = currentSeatPage === totalPages - 1 ? 'none' : 'block';
    }
  }

  if (nextSeatsBtn) {
    nextSeatsBtn.addEventListener('click', () => {
      if (currentSeatPage < totalPages - 1) {
        currentSeatPage++;
        updateSeatPagination();
      }
    });
  }

  if (prevSeatsBtn) {
    prevSeatsBtn.addEventListener('click', () => {
      if (currentSeatPage > 0) {
        currentSeatPage--;
        updateSeatPagination();
      }
    });
  }

  updateSeatPagination();
});
