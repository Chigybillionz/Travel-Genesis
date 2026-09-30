function showError(msg) {
  const existing = document.getElementById('custom-error-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'custom-error-toast';
  toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#f44336;color:white;padding:12px 24px;border-radius:8px;font-family:sans-serif;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:9999;display:flex;align-items:center;gap:12px;opacity:0;transition:opacity 0.3s;';
  toast.innerHTML = `<span>${msg.replace(/\n/g, '<br>')}</span><button style="background:none;border:none;color:white;font-weight:bold;cursor:pointer;padding:0;font-size:16px;">&times;</button>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.style.opacity = '1');
  toast.querySelector('button').onclick = () => {
    toast.style.opacity = '0';
    setTimeout(() => { if(document.body.contains(toast)) toast.remove(); }, 300);
  };
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.style.opacity = '0';
      setTimeout(() => { if(document.body.contains(toast)) toast.remove(); }, 300);
    }
  }, 4000);
}

function selectFlight(element) {
  // Remove selected class from all cards
  document.querySelectorAll(".flight-card").forEach((card) => {
    card.classList.remove("selected");
  });

  // Add selected class to clicked card
  element.classList.add("selected");
}

function continueFlight() {
  const selectedFlight = document.querySelector(".flight-card.selected");
  if (selectedFlight) {
    window.location.href = "../../booking/date-picker/datepicker.html";
  } else {
    showError("Please select a flight first!");
  }
}

function goBack() {
  window.location.href = "../../booking/home/home.html";
}

document.body.style.opacity = "0";
setTimeout(() => {
  document.body.style.transition = "opacity 0.3s ease";
  document.body.style.opacity = "1";
}, 100);
