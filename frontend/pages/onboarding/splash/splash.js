// Smooth automatic redirect to Onboarding 1
setTimeout(() => {
  const container = document.querySelector('.splash-screen');
  if (container) {
    container.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    container.style.opacity = '0';
    container.style.transform = 'scale(0.98)';
  }
  setTimeout(() => {
    window.location.href = "/onboarding";
  }, 400);
}, 2200);
