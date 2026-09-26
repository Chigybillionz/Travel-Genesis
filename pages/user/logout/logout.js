// for the cancel button

document.addEventListener("DOMContentLoaded", function () {
  const cancelbtn = document.getElementById("btn-cancelbtn-cancel");
  if (cancelbtn) {
    cancelbtn.addEventListener("click", function () {
      console.log("returning to home page...");

      window.location.href = "../../user/profile/profile.html";
    });
  }
});

// for the logout button
document.addEventListener("DOMContentLoaded", function () {
  const logoutbtn = document.getElementById("btn-cancelbtn-logout");
  if (logoutbtn) {
    logoutbtn.addEventListener("click", function () {
      console.log("returning to home page...");

      window.location.href = "../../auth/login/login.html";
    });
  }
});
