/**
 * Travel Genesis - My Trips Page Handler
 * Connects to live /api/bookings/my-trips, manages real-time tab counts,
 * and dynamically filters upcoming vs cancelled trips.
 */

document.addEventListener("DOMContentLoaded", async function () {
  let allTrips = [];
  let currentFilter = "upcoming";

  // 1. Sync passenger name from logged-in user
  const passengerNameElement = document.getElementById("passengerName");
  let loggedInUserName = "Solo";
  const cachedName = localStorage.getItem("userFullName") || localStorage.getItem("userName");
  if (cachedName) {
    loggedInUserName = cachedName;
  } else if (window.API && typeof window.API.getUser === "function" && window.API.getUser()) {
    loggedInUserName = window.API.getUser().name || "Solo";
  }
  if (passengerNameElement) {
    passengerNameElement.textContent = loggedInUserName;
  }

  // 2. Load trips from Backend API or LocalStorage
  await loadTripsData();

  async function loadTripsData() {
    let trips = [];

    if (window.API && typeof API.isAuthenticated === "function" && API.isAuthenticated()) {
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

    // Fallback: check localStorage for last confirmed booking
    if (trips.length === 0) {
      const lastBookingRaw = localStorage.getItem("lastBooking");
      if (lastBookingRaw) {
        try {
          const parsed = JSON.parse(lastBookingRaw);
          if (parsed) trips.push(parsed);
        } catch (e) {}
      }
    }

    // Fallback 2: check chosen flight from booking wizard
    if (trips.length === 0) {
      const chosenFlightRaw = localStorage.getItem("chosenFlight");
      if (chosenFlightRaw) {
        try {
          const flight = JSON.parse(chosenFlightRaw);
          const bookingSeats = JSON.parse(localStorage.getItem("bookingSeats") || '["14A"]');
          const bookingDate = localStorage.getItem("bookingDate") || "Wed, 03 Dec 2025";
          const mockBooking = {
            _id: "local-mock-1",
            bookingReference: `TG-${flight.destinationCity ? flight.destinationCity.substring(0, 3).toUpperCase() : "BK"}-8892`,
            flightId: flight,
            seatNumber: bookingSeats.join(", "),
            flightClass: localStorage.getItem("bookingCabinClass") || "Economy",
            passengerName: loggedInUserName,
            date: bookingDate,
            status: "Confirmed",
          };
          trips.push(mockBooking);
        } catch (e) {}
      }
    }

    // Sync status with session storage if previously cancelled
    const sessionTripStatus = localStorage.getItem("tripStatus");
    if (sessionTripStatus === "Cancelled" && trips.length > 0) {
      // Mark matching or first trip as Cancelled if not already
      trips[0].status = "Cancelled";
    }

    allTrips = trips;

    // Update tab badges and render active filter view
    updateCounters();
    renderTripsForFilter(currentFilter);
  }

  // 3. Dynamic Tab Counters
  function updateCounters() {
    const upcomingTrips = allTrips.filter((t) => t.status !== "Cancelled" && t.status !== "Completed");
    const completedTrips = allTrips.filter((t) => t.status === "Completed");
    const cancelledTrips = allTrips.filter((t) => t.status === "Cancelled");

    const upcomingBadge = document.getElementById("upcomingCount");
    const completedBadge = document.getElementById("completedCount");
    const cancelledBadge = document.getElementById("cancelledCount");

    if (upcomingBadge) upcomingBadge.textContent = upcomingTrips.length;
    if (completedBadge) completedBadge.textContent = completedTrips.length;
    if (cancelledBadge) cancelledBadge.textContent = cancelledTrips.length;
  }

  // 4. Render Trips Based on Filter (Upcoming / Completed / Cancelled)
  function renderTripsForFilter(filter) {
    const container = document.getElementById("tripsListContainer");
    if (!container) return;

    let filtered = [];
    if (filter === "upcoming") {
      filtered = allTrips.filter((t) => t.status !== "Cancelled" && t.status !== "Completed");
    } else if (filter === "completed") {
      filtered = allTrips.filter((t) => t.status === "Completed");
    } else if (filter === "cancelled") {
      filtered = allTrips.filter((t) => t.status === "Cancelled");
    }

    // Clean container contents
    container.innerHTML = "";

    if (filtered.length === 0) {
      renderEmptyState(container, filter);
      return;
    }

    // Render cards for filtered items
    filtered.forEach((booking) => {
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "trip-card-block";
      cardWrapper.style.marginBottom = "24px";
      cardWrapper.innerHTML = buildTripCardHTML(booking, filter);
      container.appendChild(cardWrapper);
    });

    // Bind event handlers for cards in this view
    bindCardActions(container, filtered);
  }

  // 5. Build HTML markup for a single trip card
  function buildTripCardHTML(booking, filter) {
    const flight = booking.flightId || booking.flight || {};
    const dest = flight.destination || {};

    const bookingRef = booking.bookingReference || "TG-CONFIRMED";
    const airline = flight.airline || "British Airways";
    const flightNo = flight.flightNumber || "TG-101";
    const duration = flight.duration || "6h 30m";
    const seatNumber = booking.seatNumber || "14A";
    const cabinClass = booking.flightClass || "Economy";
    const passenger = booking.passengerName || loggedInUserName;

    const depCity = flight.originCity || "Lagos";
    const depCode = flight.originCode || "LOS";
    const depAirport = flight.originAirport || "Murtala Muhammed Intl";
    const depTime = flight.depTime || "07:30 AM";
    const depDate = booking.departureDate || booking.date || "Wed, 03 Dec 2025";

    const arrCity = dest.city || flight.destinationCity || "London";
    const arrCode = dest.code || flight.destinationCode || "LHR";
    const arrAirport = dest.airport || flight.destinationAirport || `${arrCity} Airport`;
    const arrTime = flight.arrTime || "02:15 PM";
    const arrDate = booking.arrivalDate || booking.date || "Wed, 03 Dec 2025";

    const isCancelled = booking.status === "Cancelled";
    const isCompleted = booking.status === "Completed";

    let sectionTitle = "Upcoming Flight";
    if (isCancelled) sectionTitle = "Cancelled Flight";
    if (isCompleted) sectionTitle = "Completed Journey";

    let statusBadgeHTML = "";
    if (isCancelled) {
      statusBadgeHTML = `
        <div class="flight-status-badge cancelled" style="background:#FEE2E2;color:#991B1B;">
          <i class="fa-solid fa-ban"></i>
          <span>Cancelled</span>
        </div>
      `;
    } else if (isCompleted) {
      statusBadgeHTML = `
        <div class="flight-status-badge completed" style="background:#E0F2FE;color:#0369A1;">
          <i class="fa-solid fa-plane-arrival"></i>
          <span>Completed</span>
        </div>
      `;
    } else {
      statusBadgeHTML = `
        <div class="flight-status-badge confirmed">
          <i class="fa-solid fa-circle-check"></i>
          <span>Confirmed • On Schedule</span>
        </div>
      `;
    }

    let footerNoticeHTML = "";
    let footerButtonsHTML = "";

    if (isCancelled) {
      footerNoticeHTML = `
        <div class="checkin-notice">
          <i class="fa-solid fa-circle-xmark" style="color:#EF4444;"></i>
          <span style="color:#991B1B;font-weight:600;">This booking was cancelled.</span>
        </div>
      `;
      footerButtonsHTML = `
        <div class="footer-buttons">
          <button class="action-btn ticket-btn" data-booking-ref="${bookingRef}">
            <i class="fa-solid fa-ticket"></i>
            <span>View E-Ticket</span>
          </button>
        </div>
      `;
    } else {
      footerNoticeHTML = `
        <div class="checkin-notice">
          <i class="fa-solid fa-circle-info"></i>
          <span>Online check-in opens 24 hours prior to departure.</span>
        </div>
      `;
      footerButtonsHTML = `
        <div class="footer-buttons">
          <button class="action-btn cancel-btn" data-booking-id="${booking._id || ''}" data-booking-ref="${bookingRef}">
            <i class="fa-solid fa-xmark"></i>
            <span>Cancel Booking</span>
          </button>
          <button class="action-btn ticket-btn" data-booking-ref="${bookingRef}">
            <i class="fa-solid fa-ticket"></i>
            <span>View E-Ticket</span>
          </button>
        </div>
      `;
    }

    return `
      <div class="section-label" style="margin-bottom:12px;">
        <span>${sectionTitle}</span>
        <span class="ref-tag">Booking Ref: #${bookingRef}</span>
      </div>

      <article class="desktop-flight-card" style="display:block;">
        <div class="flight-card-header">
          <div class="airline-brand">
            <div class="airline-logo-box">
              <i class="fa-solid fa-plane-departure"></i>
            </div>
            <div class="airline-meta">
              <div class="airline-name">${airline}</div>
              <div class="flight-no">Flight ${flightNo} • Scheduled</div>
            </div>
          </div>
          ${statusBadgeHTML}
        </div>

        <!-- Route Visualizer -->
        <div class="flight-route-body">
          <div class="route-node departure-node">
            <div class="city-name">${depCity}</div>
            <div class="airport-code">${depCode}</div>
            <div class="airport-detail">${depAirport}</div>
            <div class="schedule-time">
              <i class="fa-regular fa-clock"></i>
              <span>${depTime}</span>
            </div>
            <div class="schedule-date">${depDate}</div>
          </div>

          <div class="flight-path-center">
            <div class="flight-duration">${duration}</div>
            <div class="path-visual">
              <div class="path-dot start"></div>
              <div class="path-line">
                <div class="path-track"></div>
                <div class="plane-marker">
                  <i class="fa-solid fa-plane"></i>
                </div>
              </div>
              <div class="path-dot end"></div>
            </div>
            <div class="flight-type-pill">Non-Stop • Direct</div>
          </div>

          <div class="route-node arrival-node">
            <div class="city-name">${arrCity}</div>
            <div class="airport-code">${arrCode}</div>
            <div class="airport-detail">${arrAirport}</div>
            <div class="schedule-time">
              <i class="fa-regular fa-clock"></i>
              <span>${arrTime}</span>
            </div>
            <div class="schedule-date">${arrDate}</div>
          </div>
        </div>

        <!-- Passenger & Seat Detail Bar -->
        <div class="flight-amenities-bar">
          <div class="amenity-item">
            <i class="fa-solid fa-user"></i>
            <div>
              <div class="amenity-label">Passenger</div>
              <div class="amenity-value">${passenger}</div>
            </div>
          </div>
          <div class="amenity-item">
            <i class="fa-solid fa-couch"></i>
            <div>
              <div class="amenity-label">Seat Assigned</div>
              <div class="amenity-value">${seatNumber} (${cabinClass})</div>
            </div>
          </div>
          <div class="amenity-item">
            <i class="fa-solid fa-suitcase-rolling"></i>
            <div>
              <div class="amenity-label">Baggage</div>
              <div class="amenity-value">2 × 23kg Included</div>
            </div>
          </div>
          <div class="amenity-item">
            <i class="fa-solid fa-door-open"></i>
            <div>
              <div class="amenity-label">Terminal / Gate</div>
              <div class="amenity-value">Terminal 2 • Gate B14</div>
            </div>
          </div>
        </div>

        <!-- Card Action Footer -->
        <div class="flight-card-footer">
          ${footerNoticeHTML}
          ${footerButtonsHTML}
        </div>
      </article>
    `;
  }

  // 6. Bind event listeners for dynamically rendered cards
  function bindCardActions(container, currentBookings) {
    // Ticket buttons
    const ticketBtns = container.querySelectorAll(".ticket-btn");
    ticketBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const ref = this.getAttribute("data-booking-ref");
        const found = allTrips.find((t) => (t.bookingReference || "TG-CONFIRMED") === ref);
        if (found) {
          localStorage.setItem("lastBooking", JSON.stringify(found));
        }
        window.location.href = "/e-ticket";
      });
    });

    // Cancel buttons
    const cancelBtns = container.querySelectorAll(".cancel-btn");
    cancelBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const bookingId = this.getAttribute("data-booking-id");
        const bookingRef = this.getAttribute("data-booking-ref");

        const targetBooking = allTrips.find(
          (t) => (t._id && t._id === bookingId) || (t.bookingReference || "TG-CONFIRMED") === bookingRef
        );

        if (!targetBooking) return;

        showCustomConfirm(
          "Are you sure you want to cancel this booking? This flight will be moved to your Cancelled tab.",
          async () => {
            // Call API if real backend booking
            if (targetBooking._id && !targetBooking._id.startsWith("local-") && window.API && API.isAuthenticated()) {
              try {
                await API.bookings.cancel(targetBooking._id, "Passenger cancellation request");
                showCustomAlert("Booking cancelled successfully.");
              } catch (err) {
                console.warn("Cancel API error:", err.message);
                showCustomAlert("Booking marked as cancelled locally.");
              }
            } else {
              showCustomAlert("Booking cancelled successfully.");
            }

            // 1. Mark status as Cancelled
            targetBooking.status = "Cancelled";
            localStorage.setItem("tripStatus", "Cancelled");

            // Also update localStorage lastBooking if matching
            try {
              const lb = JSON.parse(localStorage.getItem("lastBooking") || "null");
              if (lb && (lb._id === targetBooking._id || lb.bookingReference === targetBooking.bookingReference)) {
                lb.status = "Cancelled";
                localStorage.setItem("lastBooking", JSON.stringify(lb));
              }
            } catch (_) {}

            // 2. Immediately update the tab counts
            updateCounters();

            // 3. Re-render the current filter (it moves away immediately from Upcoming!)
            renderTripsForFilter(currentFilter);
          }
        );
      });
    });
  }

  // 7. Render Empty States
  function renderEmptyState(container, filter) {
    let icon = "fa-plane-departure";
    let title = "No Upcoming Trips";
    let desc = "You don't have any upcoming flights scheduled. Ready to take off on your next journey?";
    let btnText = "Book New Flight";
    let btnHref = "/home";

    if (filter === "cancelled") {
      icon = "fa-calendar-xmark";
      title = "No Cancelled Trips";
      desc = "You have no cancelled bookings on record. All your journeys remain active or completed.";
      btnText = "Explore Destinations";
      btnHref = "/explore";
    } else if (filter === "completed") {
      icon = "fa-passport";
      title = "No Completed Trips Yet";
      desc = "Your flight history will be cataloged here once your travels conclude.";
      btnText = "Plan Your Trip";
      btnHref = "/home";
    }

    container.innerHTML = `
      <div id="trips-empty-state" style="background:#FFFFFF;border-radius:20px;padding:56px 28px;text-align:center;color:#64748B;border:1.5px dashed #CBD5E1;box-shadow:0 4px 20px rgba(0,0,0,0.03);margin-top:8px;">
        <div style="width:72px;height:72px;background:rgba(0,122,140,0.08);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;color:#007A8C;font-size:28px;">
          <i class="fa-solid ${icon}"></i>
        </div>
        <h3 style="color:#0F172A;font-size:22px;font-weight:700;margin-bottom:8px;">${title}</h3>
        <p style="font-size:15px;max-width:380px;margin:0 auto 24px;line-height:1.5;color:#64748B;">${desc}</p>
        <a href="${btnHref}" class="book-new-btn" style="display:inline-flex;margin:0 auto;text-decoration:none;">
          <i class="fa-solid fa-plus"></i>
          <span>${btnText}</span>
        </a>
      </div>
    `;
  }

  // 8. Custom Modal & Alerts
  function showCustomConfirm(msg, onConfirm) {
    const existing = document.getElementById("custom-confirm-modal");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "custom-confirm-modal";
    overlay.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);display:flex;justify-content:center;align-items:center;z-index:9999;opacity:0;transition:opacity 0.25s;";

    const modal = document.createElement("div");
    modal.style.cssText =
      "background:white;padding:32px 28px;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.15);max-width:420px;width:90%;text-align:center;transform:scale(0.95);transition:transform 0.25s;font-family:'Plus Jakarta Sans',sans-serif;";

    modal.innerHTML = `
      <div style="width:60px;height:60px;background:#FEE2E2;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:#EF4444;font-size:24px;">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <h3 style="margin:0 0 10px 0;color:#0F172A;font-size:20px;font-weight:800;">Cancel Flight Booking?</h3>
      <p style="margin:0 0 24px 0;color:#64748B;font-size:14.5px;line-height:1.5;">${msg}</p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button id="cancel-no-btn" style="padding:12px 20px;border:none;background:#F1F5F9;color:#475569;font-weight:700;border-radius:12px;cursor:pointer;flex:1;font-size:14px;transition:background 0.2s;">Keep Booking</button>
        <button id="cancel-yes-btn" style="padding:12px 20px;border:none;background:#EF4444;color:white;font-weight:700;border-radius:12px;cursor:pointer;flex:1;font-size:14px;box-shadow:0 4px 12px rgba(239,68,68,0.3);transition:background 0.2s;">Yes, Cancel</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      modal.style.transform = "scale(1)";
    });

    document.getElementById("cancel-no-btn").onclick = () => {
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 250);
    };

    document.getElementById("cancel-yes-btn").onclick = () => {
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 250);
      onConfirm();
    };
  }

  function showCustomAlert(msg, isError = false) {
    const existing = document.getElementById("custom-alert-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "custom-alert-toast";
    const bg = isError ? "#EF4444" : "#10B981";
    toast.style.cssText = `position:fixed;top:30px;left:50%;transform:translateX(-50%);background:${bg};color:white;padding:14px 22px;border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.18);z-index:9999;display:flex;align-items:center;gap:12px;opacity:0;transition:opacity 0.25s;`;
    toast.innerHTML = `
      <i class="fa-solid ${isError ? "fa-circle-xmark" : "fa-circle-check"}"></i>
      <span>${msg}</span>
      <button style="background:none;border:none;color:white;font-weight:bold;cursor:pointer;padding:0;font-size:18px;margin-left:8px;">&times;</button>
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => (toast.style.opacity = "1"));

    toast.querySelector("button").onclick = () => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 250);
    };

    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 250);
      }
    }, 3500);
  }

  // 9. Tab Button Listeners
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      tabButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      currentFilter = this.getAttribute("data-filter") || "upcoming";
      renderTripsForFilter(currentFilter);
    });
  });

  // 10. Mobile Bottom Navigation
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");
  navItems.forEach((item) => {
    const label = (item.textContent || "").trim().toLowerCase();
    if (label.includes("home")) {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/home";
      });
    } else if (label.includes("explore")) {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/explore";
      });
    } else if (label.includes("profile")) {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/profile";
      });
    }
  });
});
