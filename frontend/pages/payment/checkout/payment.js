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
  function startPaymentProcess() {
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

    // Simulate processing time - 3 seconds
    setTimeout(() => {
      // Hide loader and processing text, show checkmark
      payBtnLoading.classList.remove("show");
      payBtnLoader.classList.remove("show");
      payBtnProcessing.classList.remove("show");
      payBtnCheckmark.classList.add("show");

      // After checkmark animation, show success screen
      setTimeout(() => {
        successScreen.classList.add("active");
      }, 800);
    }, 3000);
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
