// for the cancel button

document.addEventListener("DOMContentLoaded", function () {
  const cancelbtn = document.getElementById("btn-cancelbtn-cancel");
  if (cancelbtn) {
    cancelbtn.addEventListener("click", function () {
      console.log("returning to profile page...");

      window.location.href = "/profile";
    });
  }
});

// for the logout button
document.addEventListener("DOMContentLoaded", function () {
  const logoutbtn = document.getElementById("btn-cancelbtn-logout");
  if (logoutbtn) {
    logoutbtn.addEventListener("click", function () {
      console.log("Logging out user and clearing session...");
      if (window.API) {
        window.API.logout();
      } else {
        localStorage.clear();
      }
      window.location.href = "/login";
    });
  }
});
