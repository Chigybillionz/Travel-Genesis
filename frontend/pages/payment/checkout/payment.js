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
      alert("Please login to complete your payment");
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
            alert('Payment window closed.');
            payBtnText.style.display = "block";
            payBtnLoading.classList.remove("show");
            payBtnLoader.classList.remove("show");
            payBtnProcessing.classList.remove("show");
            payBtn.disabled = false;
          },
          callback: async function(response) {
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
                alert("Payment verification failed.");
                payBtnText.style.display = "block";
                payBtnLoading.classList.remove("show");
                payBtnLoader.classList.remove("show");
                payBtnProcessing.classList.remove("show");
                payBtn.disabled = false;
              }
            } catch (err) {
              alert("Error verifying payment: " + err.message);
              payBtnText.style.display = "block";
              payBtnLoading.classList.remove("show");
              payBtnLoader.classList.remove("show");
              payBtnProcessing.classList.remove("show");
              payBtn.disabled = false;
            }
          }
        });
        handler.openIframe();
      }
    } catch (err) {
      alert("Payment initialization failed: " + err.message);
      payBtnText.style.display = "block";
      payBtnLoading.classList.remove("show");
      payBtnLoader.classList.remove("show");
      payBtnProcessing.classList.remove("show");
      payBtn.disabled = false;
    }
  }

  if (viewTicketsBtn) {
    viewTicketsBtn.addEventListener("click", () => {
      window.location.href = "../../trips/e-ticket/e-ticket.html";
    });
  }

  // Handle Back to Home button
  if (backHomeBtn) {
    backHomeBtn.addEventListener("click", () => {
      window.location.href = "../../booking/home/home.html";
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.querySelector("#back-button");
  if (backButton) {
    backButton.addEventListener("click", function () {
      console.log("Back button clicked! Navigating to bookings page...");
      window.location.href = "../../booking/booking-details/bookings.html";
    });
  }
});
