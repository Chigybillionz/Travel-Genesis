// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Settings script loaded!");

  // Back button functionality
  const backBtn = document.querySelector(".back-btn");
  if (backBtn) {
    console.log("Back button found!");
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Back button clicked! Navigating to profile page...");
      // Navigate back to profile page
      window.location.href = "../../user/profile/profile.html";
    });
  }

  // Push notifications toggle functionality (optional)
  const notificationToggle = document.querySelector(
    '.switch input[type="checkbox"]'
  );
  if (notificationToggle) {
    notificationToggle.addEventListener("change", function () {
      if (this.checked) {
        console.log("Push notifications enabled");
        // You can add logic here to enable notifications
      } else {
        console.log("Push notifications disabled");
      }
    });
  }

  // Language setting click (optional - for future expansion)
  const languageSetting = document.querySelector(".setting-item:first-child");
  if (languageSetting) {
    languageSetting.addEventListener("click", function (e) {
      // Only trigger if not clicking on other interactive elements
      if (!e.target.closest(".switch")) {
        console.log(
          "Language setting clicked - can open language selector modal"
        );
        // You can add language selection modal here in the future
      }
    });
  }
});
