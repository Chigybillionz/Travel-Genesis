document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("back-btn");
  const nextBtn = document.getElementById("next-btn");

  let selectedFullDate = null;

  // Back button
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "../../booking/flight-details/flight.html";
    });
  }

  // Handle day selection (WITH month & year)
  const calendars = document.querySelectorAll(".calendar");

  calendars.forEach((calendar) => {
    const monthYear = calendar.querySelector(".month-year").textContent;
    const days = calendar.querySelectorAll(".day:not(.empty)");

    days.forEach((day) => {
      day.addEventListener("click", () => {
        // Remove previous selection
        document
          .querySelectorAll(".day")
          .forEach((d) => d.classList.remove("selected"));

        day.classList.add("selected");

        selectedFullDate = `${day.textContent} ${monthYear}`;
        console.log("Selected date:", selectedFullDate);
      });
    });
  });

  // Next button
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!selectedFullDate) {
        alert("Please select a date first");
        return;
      }

      // SAVE DATE
      localStorage.setItem("bookingDate", selectedFullDate);

      // GO TO SEAT PAGE
      window.location.href = "../../booking/seat-selection/seat.html";
    });
  }
});
