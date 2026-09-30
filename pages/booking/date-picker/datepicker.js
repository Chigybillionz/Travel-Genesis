document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("back-btn");
  const nextBtn = document.getElementById("next-btn");
  const calendarWrapper = document.getElementById("calendar-wrapper");

  let selectedDateObj = null;
  let selectedFullDateStr = null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let displayMonth = today.getMonth();
  let displayYear = today.getFullYear();

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "../../booking/flight-details/flight.html";
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!selectedFullDateStr) {
        alert("Please select a date first");
        return;
      }
      localStorage.setItem("bookingDate", selectedFullDateStr);
      window.location.href = "../../booking/seat-selection/seat.html";
    });
  }

  function renderCalendars() {
    calendarWrapper.innerHTML = "";
    
    // Left Calendar
    calendarWrapper.appendChild(createCalendarElement(displayYear, displayMonth, true));
    
    // Right Calendar
    let rightMonth = displayMonth + 1;
    let rightYear = displayYear;
    if (rightMonth > 11) {
      rightMonth = 0;
      rightYear++;
    }
    calendarWrapper.appendChild(createCalendarElement(rightYear, rightMonth, false));
  }

  function createCalendarElement(year, month, isLeft) {
    const calDiv = document.createElement("div");
    calDiv.className = "calendar";

    const headerDiv = document.createElement("div");
    headerDiv.className = "calendar-header";
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const prevBtn = document.createElement("button");
    prevBtn.className = "nav-month-btn prev-month";
    prevBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>`;
    
    if (year === today.getFullYear() && month === today.getMonth()) {
      prevBtn.disabled = true;
      prevBtn.classList.add("disabled");
    }
    
    prevBtn.addEventListener("click", () => {
      displayMonth--;
      if (displayMonth < 0) {
        displayMonth = 11;
        displayYear--;
      }
      renderCalendars();
    });

    const nextBtn = document.createElement("button");
    nextBtn.className = "nav-month-btn next-month";
    nextBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`;
    
    nextBtn.addEventListener("click", () => {
      displayMonth++;
      if (displayMonth > 11) {
        displayMonth = 0;
        displayYear++;
      }
      renderCalendars();
    });

    const title = document.createElement("h2");
    title.className = "month-year";
    title.textContent = `${monthNames[month]} ${year}`;
    
    if (isLeft) {
      headerDiv.appendChild(prevBtn);
      headerDiv.appendChild(title);
      
      const nextBtnMobile = nextBtn.cloneNode(true);
      nextBtnMobile.classList.add("mobile-only-btn");
      nextBtnMobile.addEventListener("click", () => {
        displayMonth++;
        if (displayMonth > 11) {
          displayMonth = 0;
          displayYear++;
        }
        renderCalendars();
      });
      headerDiv.appendChild(nextBtnMobile);
      
      const dummyDesktop = document.createElement("div");
      dummyDesktop.className = "desktop-only-spacer";
      headerDiv.appendChild(dummyDesktop);
    } else {
      const dummyDesktop = document.createElement("div");
      dummyDesktop.className = "desktop-only-spacer";
      headerDiv.appendChild(dummyDesktop);
      
      const prevBtnMobile = prevBtn.cloneNode(true);
      prevBtnMobile.classList.add("mobile-only-btn");
      if (year === today.getFullYear() && month === today.getMonth()) {
        prevBtnMobile.disabled = true;
        prevBtnMobile.classList.add("disabled");
      }
      prevBtnMobile.addEventListener("click", () => {
        displayMonth--;
        if (displayMonth < 0) {
          displayMonth = 11;
          displayYear--;
        }
        renderCalendars();
      });
      headerDiv.appendChild(prevBtnMobile);
      
      headerDiv.appendChild(title);
      headerDiv.appendChild(nextBtn);
    }

    calDiv.appendChild(headerDiv);

    // Weekdays
    const weekdaysDiv = document.createElement("div");
    weekdaysDiv.className = "weekdays";
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(wd => {
      const wDiv = document.createElement("div");
      wDiv.className = "weekday";
      wDiv.textContent = wd;
      weekdaysDiv.appendChild(wDiv);
    });
    calDiv.appendChild(weekdaysDiv);

    // Days
    const daysDiv = document.createElement("div");
    daysDiv.className = "days";

    const firstDay = new Date(year, month, 1);
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < startDayOfWeek; i++) {
      const empty = document.createElement("div");
      empty.className = "day empty";
      daysDiv.appendChild(empty);
    }

    for (let i = 1; i <= lastDay; i++) {
      const dayDiv = document.createElement("div");
      dayDiv.className = "day";
      dayDiv.textContent = i;
      
      const currentDate = new Date(year, month, i);
      currentDate.setHours(0, 0, 0, 0);

      if (currentDate < today) {
        dayDiv.classList.add("past-date");
      } else {
        dayDiv.classList.add("available-date");
        
        if (currentDate.getTime() === today.getTime()) {
          dayDiv.classList.add("today-date");
        }
        
        if (selectedDateObj && currentDate.getTime() === selectedDateObj.getTime()) {
          dayDiv.classList.add("selected");
        }

        dayDiv.addEventListener("click", () => {
          selectedDateObj = new Date(currentDate);
          selectedFullDateStr = `${i} ${monthNames[month]} ${year}`;
          renderCalendars();
        });
      }

      daysDiv.appendChild(dayDiv);
    }

    calDiv.appendChild(daysDiv);

    return calDiv;
  }

  renderCalendars();
});
