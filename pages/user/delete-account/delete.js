// for the cancel button

document.addEventListener("DOMContentLoaded", function () {
  const cancelbtn = document.getElementById("btn-cancelbtn-cancel");
  if (cancelbtn) {
    cancelbtn.addEventListener("click", function () {
      console.log("returning to profile...");

      window.location.href = "../../user/profile/profile.html";
    });
  }
});

// for the delete account button
document.addEventListener("DOMContentLoaded", function () {
  const logoutbtn = document.getElementById("btn-cancelbtn-delete");
  if (logoutbtn) {
    logoutbtn.addEventListener("click", function () {
      console.log("returning to splash page...");

      window.location.href = "../../onboarding/splash/splash.html";
    });
  }
});
