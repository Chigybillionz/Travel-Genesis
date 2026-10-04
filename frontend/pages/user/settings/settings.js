document.addEventListener("DOMContentLoaded", function () {

  // Back button
  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      if (document.referrer) {
        history.back();
      } else {
        window.location.href = "../profile/profile.html";
      }
    });
  }

  // Load user info into profile card
  function loadUserInfo() {
    const cachedName  = localStorage.getItem("userFullName") || localStorage.getItem("userName") || "";
    const cachedEmail = localStorage.getItem("userEmail") || "";

    function getInitials(name) {
      const parts = (name || "").trim().split(/\s+/).filter(Boolean);
      return ((parts[0] ? parts[0][0] : "") + (parts.length > 1 ? parts[parts.length-1][0] : "")).toUpperCase() || "TG";
    }

    const cachedAvatar = localStorage.getItem("userAvatar") || "";

    function renderSettingsAvatar(avatarUrl, name) {
      if (!avatarEl) return;
      if (avatarUrl && avatarUrl.trim()) {
        avatarEl.innerHTML = `<img src="${avatarUrl}" alt="${name || 'User'}" style="width:100%;height:100%;object-fit:cover;" />`;
      } else {
        avatarEl.textContent = getInitials(name);
      }
    }

    renderSettingsAvatar(cachedAvatar, cachedName);
    if (cachedName  && nameEl)     nameEl.textContent     = cachedName;
    if (cachedEmail && emailEl)    emailEl.textContent    = cachedEmail;
    if (cachedName  && nameValEl)  nameValEl.textContent  = cachedName;
    if (cachedEmail && emailValEl) emailValEl.textContent = cachedEmail;

    if (window.API && API.isAuthenticated && API.isAuthenticated()) {
      API.users.getProfile().then(function (res) {
        const u = res && res.user;
        if (!u) return;
        renderSettingsAvatar(u.avatarUrl || cachedAvatar, u.name || cachedName);
        if (nameEl)     nameEl.textContent     = u.name  || cachedName;
        if (emailEl)    emailEl.textContent    = u.email || cachedEmail;
        if (nameValEl)  nameValEl.textContent  = u.name  || cachedName;
        if (emailValEl) emailValEl.textContent = u.email || cachedEmail;
      }).catch(function(){});
    }
  }

  loadUserInfo();

  window.addEventListener("tg:user-updated", function () {
    loadUserInfo();
  });

  // Persist toggle states to localStorage
  function bindToggle(id, key) {
    const el = document.getElementById(id);
    if (!el) return;
    const saved = localStorage.getItem(key);
    if (saved !== null) el.checked = saved === "true";
    el.addEventListener("change", function () {
      localStorage.setItem(key, el.checked);
    });
  }

  bindToggle("toggle-push",         "pref_push_notif");
  bindToggle("toggle-email-notif",  "pref_email_notif");
  bindToggle("toggle-promo",        "pref_promo");
  bindToggle("toggle-darkmode",     "pref_darkmode");
  bindToggle("toggle-biometric",    "pref_biometric");
  bindToggle("toggle-location",     "pref_location");
  bindToggle("toggle-analytics",    "pref_analytics");

  // Seat class select
  const seatSelect = document.getElementById("seat-class-select");
  const seatVal    = document.getElementById("settings-seat-class");
  if (seatSelect) {
    const saved = localStorage.getItem("pref_seat_class");
    if (saved) {
      seatSelect.value = saved;
      if (seatVal) seatVal.textContent = saved;
    }
    seatSelect.addEventListener("change", function () {
      localStorage.setItem("pref_seat_class", seatSelect.value);
      if (seatVal) seatVal.textContent = seatSelect.value;
    });
  }
});
