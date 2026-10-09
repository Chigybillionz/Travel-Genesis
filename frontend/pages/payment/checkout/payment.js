function showError(msg) {
  const existing = document.getElementById('custom-error-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'custom-error-toast';
  toast.style.cssText = 'position:fixed;top:30px;left:50%;transform:translateX(-50%);background:#f44336;color:white;padding:16px 24px;border-radius:8px;font-family:sans-serif;font-size:15px;box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:9999;display:flex;align-items:center;gap:12px;opacity:0;transition:opacity 0.3s;';
  toast.innerHTML = `<span>${msg.replace(/\n/g, '<br>')}</span><button style="background:none;border:none;color:white;font-weight:bold;cursor:pointer;padding:0;font-size:20px;margin-left:8px;">&times;</button>`;
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

// Payment Processing Flow
document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.getElementById("pay-btn");
  const successScreen = document.getElementById("success-screen");
  const viewTicketsBtn = document.getElementById("view-tickets-btn");
  const backHomeBtn = document.getElementById("back-home-btn");

  // Handle Pay Now button click
  if (payBtn) {
    payBtn.addEventListener("click", (e) => {
      e.preventDefault();
      startPaymentProcess();
    });
  }

  // Start payment processing with button animation
  async function startPaymentProcess() {
    const payBtnText = payBtn.querySelector(".pay-btn-text");
    const payBtnLoading = payBtn.querySelector(".pay-btn-loading");
    const payBtnLoader = payBtn.querySelector(".pay-btn-loader");
    const payBtnProcessing = payBtn.querySelector(".pay-btn-processing");
    const payBtnCheckmark = payBtn.querySelector(".pay-btn-checkmark");

    // Hide text and show loader with "Processing..." text
    payBtnText.style.display = "none";
    payBtnLoading.classList.add("show");
    payBtnLoader.classList.add("show");
    payBtnProcessing.classList.add("show");
    payBtn.disabled = true;

    if (!window.API || !API.isAuthenticated()) {
      showError("Please login to complete your payment");
      payBtnText.style.display = "block";
      payBtnLoading.classList.remove("show");
      payBtnLoader.classList.remove("show");
      payBtnProcessing.classList.remove("show");
      payBtn.disabled = false;
      return;
    }

    const chosenFlight = JSON.parse(localStorage.getItem("chosenFlight") || "{}");
    const bookingSeats = JSON.parse(localStorage.getItem("bookingSeats") || '["14B"]');
    const totalPrice = Number(localStorage.getItem("totalPrice")) || chosenFlight.price || 1050000;
    const user = API.getUser();

    try {
      const initData = await API.request('/payments/initialize', {
        method: 'POST',
        body: JSON.stringify({
          amount: totalPrice,
          email: user ? user.email : "user@travelgenesis.com",
          flightId: chosenFlight.flightNumber || chosenFlight.destinationCity || "TG-101",
          seatNumber: bookingSeats.join(", "),
          flightClass: chosenFlight.flightClass || localStorage.getItem("selectedFlightClass") || "Economy",
          passengerName: user ? user.name : "Traveler"
        })
      });

      if (initData && initData.status && initData.data) {
        const { publicKey, reference } = initData.data;

        const handler = PaystackPop.setup({
          key: publicKey,
          email: user ? user.email : "user@travelgenesis.com",
          amount: Math.round(totalPrice * 100),
          ref: reference,
          onClose: function() {
            showError("Payment window closed before completing the transaction.");
            payBtnText.style.display = "block";
            payBtnLoading.classList.remove("show");
            payBtnLoader.classList.remove("show");
            payBtnProcessing.classList.remove("show");
            payBtn.disabled = false;
          },
          callback: function(response) {
            (async function() {
              try {
                const verifyData = await API.request(`/payments/verify/${response.reference}`, {
                  method: 'GET'
                });

                if (verifyData && verifyData.status) {
                  // Now create the booking
                  const bookingRes = await API.bookings.create({
                    flightId: chosenFlight.flightNumber || chosenFlight.destinationCity || "TG-101",
                    seatNumber: bookingSeats.join(", "),
                    totalPrice: totalPrice,
                    flightClass: chosenFlight.flightClass || localStorage.getItem("selectedFlightClass") || "Economy",
                    passengerName: user ? user.name : "Traveler",
                    passengerEmail: user ? user.email : "user@travelgenesis.com",
                  });

                  if (bookingRes && bookingRes.data) {
                    localStorage.setItem("lastBooking", JSON.stringify(bookingRes.data));
                  }

                  payBtnLoading.classList.remove("show");
                  payBtnLoader.classList.remove("show");
                  payBtnProcessing.classList.remove("show");
                  payBtnCheckmark.classList.add("show");

                  setTimeout(() => {
                    successScreen.classList.add("active");
                  }, 800);
                } else {
                  showError("Payment verification failed. Please try again.");
                  payBtnText.style.display = "block";
                  payBtnLoading.classList.remove("show");
                  payBtnLoader.classList.remove("show");
                  payBtnProcessing.classList.remove("show");
                  payBtn.disabled = false;
                }
              } catch (err) {
                showError("Error verifying payment: " + err.message);
                payBtnText.style.display = "block";
                payBtnLoading.classList.remove("show");
                payBtnLoader.classList.remove("show");
                payBtnProcessing.classList.remove("show");
                payBtn.disabled = false;
              }
            })();
          }
        });
        handler.openIframe();
      }
    } catch (err) {
      showError("Payment initialization failed: " + err.message);
      payBtnText.style.display = "block";
      payBtnLoading.classList.remove("show");
      payBtnLoader.classList.remove("show");
      payBtnProcessing.classList.remove("show");
      payBtn.disabled = false;
    }
  }

  if (viewTicketsBtn) {
    viewTicketsBtn.addEventListener("click", () => {
      window.location.href = "/e-ticket";
    });
  }

  // Handle Back to Home button
  if (backHomeBtn) {
    backHomeBtn.addEventListener("click", () => {
      window.location.href = "/home";
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.querySelector("#back-button");
  if (backButton) {
    backButton.addEventListener("click", function () {
      console.log("Back button clicked! Navigating to bookings page...");
      window.location.href = "/booking-details";
    });
  }
});
