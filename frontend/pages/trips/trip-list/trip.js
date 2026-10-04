/**
 * Travel Genesis - My Trips Page Handler
 * Connects to live /api/bookings/my-trips and renders dynamic booking cards
 */

document.addEventListener("DOMContentLoaded", async function () {
  let activeBooking = null;

  // 1. Sync passenger name from logged-in user
  const passengerNameElement = document.getElementById("passengerName");
  if (passengerNameElement) {
    const cachedName = localStorage.getItem("userFullName") || localStorage.getItem("userName");
    if (cachedName) {
      passengerNameElement.textContent = cachedName;
    } else if (window.API && window.API.getUser()) {
      passengerNameElement.textContent = window.API.getUser().name;
    }
  }

  // 2. Load trips from Backend API or LocalStorage
  await loadTripsData();

  async function loadTripsData() {
    let trips = [];

    if (window.API && API.isAuthenticated()) {
      try {
        const response = await API.bookings.getMyTrips();
        if (response && response.data && response.data.length > 0) {
          trips = response.data;
          console.log("✅ Fetched live trips from backend:", trips);
        }
      } catch (err) {
        console.warn("Could not fetch trips from API, falling back to local storage:", err.message);
      }
    }

    // Fallback: check localStorage for last confirmed booking or chosen flight
    if (trips.length === 0) {
      const lastBookingRaw = localStorage.getItem("lastBooking");
      if (lastBookingRaw) {
        try {
          trips.push(JSON.parse(lastBookingRaw));
        } catch (e) {}
      }
    }

    if (trips.length > 0) {
      activeBooking = trips[0];
      renderBookingCard(activeBooking);
    } else {
      // Check chosen flight from flight selection
      const chosenFlightRaw = localStorage.getItem("chosenFlight");
      if (chosenFlightRaw) {
        try {
          const flight = JSON.parse(chosenFlightRaw);
          const bookingSeats = JSON.parse(localStorage.getItem("bookingSeats") || '["14B"]');
          const bookingDate = localStorage.getItem("bookingDate") || "Wed, 03 Dec 2025";
          renderCustomFlight(flight, bookingSeats, bookingDate);
        } catch (e) {}
      }
    }
  }

  function renderBookingCard(booking) {
    const flight = booking.flightId || {};
    const refEl = document.getElementById("tripBookingRef");
    const airlineEl = document.getElementById("tripAirline");
    const flightNoEl = document.getElementById("tripFlightNo");
    const depTimeEl = document.getElementById("tripDepTime");
    const depDateEl = document.getElementById("tripDepDate");
    const durationEl = document.getElementById("tripDuration");
    const arrCityEl = document.getElementById("tripArrCity");
    const arrCodeEl = document.getElementById("tripArrCode");
    const arrAirportEl = document.getElementById("tripArrAirport");
    const arrTimeEl = document.getElementById("tripArrTime");
    const arrDateEl = document.getElementById("tripArrDate");
    const seatEl = document.getElementById("tripSeat");
    const statusTextEl = document.getElementById("tripStatusText");
    const statusBadgeEl = document.getElementById("tripStatusBadge");

    if (refEl) refEl.textContent = `Booking Ref: #${booking.bookingReference || "TG-CONFIRMED"}`;
    if (airlineEl) airlineEl.textContent = flight.airline || "British Airways";
    if (flightNoEl) flightNoEl.textContent = `Flight ${flight.flightNumber || "TG-101"} • Scheduled`;
    if (durationEl) durationEl.textContent = flight.duration || "6h 30m";
    if (seatEl) seatEl.textContent = `${booking.seatNumber || "14A"} (Confirmed)`;

    if (flight.destination) {
      if (arrCityEl) arrCityEl.textContent = flight.destination.city || "London";
      if (arrCodeEl) arrCodeEl.textContent = flight.destination.code || "LHR";
      if (arrAirportEl) arrAirportEl.textContent = flight.destination.airport || `${flight.destination.city} Airport`;
    }

    if (booking.status === "Cancelled") {
      if (statusTextEl) statusTextEl.textContent = "Cancelled";
      if (statusBadgeEl) {
        statusBadgeEl.className = "flight-status-badge cancelled";
        statusBadgeEl.style.background = "#fee2e2";
        statusBadgeEl.style.color = "#991b1b";
      }
    } else {
      if (statusTextEl) statusTextEl.textContent = "Confirmed • On Schedule";
      if (statusBadgeEl) {
        statusBadgeEl.className = "flight-status-badge confirmed";
        statusBadgeEl.style.background = "#dcfce7";
        statusBadgeEl.style.color = "#166534";
      }
    }
  }

  function renderCustomFlight(flight, seats, dateStr) {
    const refEl = document.getElementById("tripBookingRef");
    const airlineEl = document.getElementById("tripAirline");
    const flightNoEl = document.getElementById("tripFlightNo");
    const depTimeEl = document.getElementById("tripDepTime");
    const depDateEl = document.getElementById("tripDepDate");
    const durationEl = document.getElementById("tripDuration");
    const arrCityEl = document.getElementById("tripArrCity");
    const arrCodeEl = document.getElementById("tripArrCode");
    const arrAirportEl = document.getElementById("tripArrAirport");
    const arrTimeEl = document.getElementById("tripArrTime");
    const arrDateEl = document.getElementById("tripArrDate");
    const seatEl = document.getElementById("tripSeat");

    if (refEl) refEl.textContent = `Booking Ref: #TG-${flight.destinationCity ? flight.destinationCity.substring(0,3).toUpperCase() : "BK"}-8892`;
    if (airlineEl) airlineEl.textContent = flight.airline || "Qatar Airways";
    if (flightNoEl) flightNoEl.textContent = `Flight ${flight.flightNumber || "QA-204"} • Scheduled`;
    if (depTimeEl && flight.depTime) depTimeEl.textContent = flight.depTime;
    if (depDateEl && dateStr) depDateEl.textContent = dateStr;
    if (durationEl && flight.duration) durationEl.textContent = flight.duration;
    if (arrCityEl && flight.destinationCity) arrCityEl.textContent = flight.destinationCity;
    if (arrCodeEl && flight.destinationCode) arrCodeEl.textContent = flight.destinationCode;
    if (arrAirportEl && flight.destinationCity) arrAirportEl.textContent = `${flight.destinationCity} International Airport`;
    if (arrTimeEl && flight.arrTime) arrTimeEl.textContent = flight.arrTime;
    if (arrDateEl && dateStr) arrDateEl.textContent = dateStr;
    if (seatEl && seats) seatEl.textContent = `${seats.join(", ")} (Window)`;
  }

  // 3. View Ticket Navigation
  const viewBtn = document.getElementById("viewBtn");
  if (viewBtn) {
    viewBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "../../trips/e-ticket/e-ticket.html";
    });
  }

  // 4. Cancel Booking Action
  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      const confirmCancel = confirm("Are you sure you want to cancel this booking?");
      if (!confirmCancel) return;

      if (activeBooking && activeBooking._id && window.API && API.isAuthenticated()) {
        try {
          await API.bookings.cancel(activeBooking._id, "Passenger cancellation request");
          alert("Booking cancelled successfully.");
        } catch (err) {
          console.warn("Cancel API error:", err.message);
        }
      }

      // Update UI state to cancelled
      const statusTextEl = document.getElementById("tripStatusText");
      const statusBadgeEl = document.getElementById("tripStatusBadge");
      if (statusTextEl) statusTextEl.textContent = "Cancelled";
      if (statusBadgeEl) {
        statusBadgeEl.className = "flight-status-badge cancelled";
        statusBadgeEl.style.background = "#fee2e2";
        statusBadgeEl.style.color = "#991b1b";
      }
      localStorage.setItem("tripStatus", "Cancelled");
    });
  }

  // 5. Filter Tabs
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      tabButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");
      const listColumn = document.querySelector(".trips-list-column");
      const flightCard = document.querySelector(".desktop-flight-card");
      const isCancelled = localStorage.getItem("tripStatus") === "Cancelled" || (activeBooking && activeBooking.status === "Cancelled");

      if (filter === "upcoming" && !isCancelled) {
        if (flightCard) flightCard.style.display = "block";
        const emptyState = document.getElementById("trips-empty-state");
        if (emptyState) emptyState.remove();
      } else if (filter === "cancelled" && isCancelled) {
        if (flightCard) flightCard.style.display = "block";
        const emptyState = document.getElementById("trips-empty-state");
        if (emptyState) emptyState.remove();
      } else {
        if (flightCard) flightCard.style.display = "none";
        let emptyState = document.getElementById("trips-empty-state");
        if (!emptyState && listColumn) {
          emptyState = document.createElement("div");
          emptyState.id = "trips-empty-state";
          emptyState.style.cssText =
            "background:#fff;border-radius:16px;padding:48px 24px;text-align:center;color:#64748B;border:1px dashed #CBD5E1;margin-top:16px;";
          emptyState.innerHTML = `
            <i class="fa-solid fa-plane-slash" style="font-size:36px;color:#94A3B8;margin-bottom:12px;"></i>
            <h3 style="color:#0F172A;font-size:18px;margin-bottom:6px;">No ${filter} trips found</h3>
            <p style="font-size:14px;max-width:320px;margin:0 auto 16px;">You don't have any ${filter} journeys in this category.</p>
            <a href="../../booking/home/home.html" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:#007A8C;color:#fff;border-radius:9999px;text-decoration:none;font-weight:700;font-size:14px;">Explore Flights</a>
          `;
          listColumn.appendChild(emptyState);
        }
      }
    });
  });

  // Mobile Bottom Navigation Handlers
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");
  navItems.forEach((item) => {
    const label = (item.textContent || "").trim().toLowerCase();

    if (label.includes("home")) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "../../booking/home/home.html";
      });
    }

    if (label.includes("explore")) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "../../user/explore/explore.html";
      });
    }

    if (label.includes("profile")) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "../../user/profile/profile.html";
      });
    }
  });
});
