/**
 * Travel Genesis - Flight Class (cabin) pricing
 * Single source of truth for Economy vs Business pricing across the booking flow.
 *
 * Catalog/base prices are Economy fares. Business fares are derived with a multiplier.
 * The selected class is persisted in localStorage under "selectedFlightClass"
 * (falls back to the user's Settings preference "pref_seat_class").
 */
(function (global) {
  const CLASSES = {
    Economy: {
      key: "Economy",
      label: "Economy",
      multiplier: 1,
      icon: "💺",
      perks: ["23kg baggage", "Standard seat", "In-flight meal"],
    },
    Business: {
      key: "Business",
      label: "Business",
      multiplier: 2.5,
      icon: "🥂",
      perks: ["2 × 32kg baggage", "Lie-flat seat", "Lounge access", "Priority boarding"],
    },
  };

  const STORAGE_KEY = "selectedFlightClass";
  const DEFAULT_CLASS = "Economy";

  function normalize(cls) {
    if (!cls) return DEFAULT_CLASS;
    const match = Object.keys(CLASSES).find((k) => k.toLowerCase() === String(cls).trim().toLowerCase());
    return match || DEFAULT_CLASS;
  }

  function getSelected() {
    return normalize(localStorage.getItem(STORAGE_KEY) || localStorage.getItem("pref_seat_class"));
  }

  function setSelected(cls) {
    const value = normalize(cls);
    localStorage.setItem(STORAGE_KEY, value);
    return value;
  }

  /** Price for a given Economy base fare in the given class (rounded to nearest ₦1,000). */
  function priceFor(basePrice, cls) {
    const base = Number(basePrice) || 0;
    const mult = CLASSES[normalize(cls)].multiplier;
    return Math.round((base * mult) / 1000) * 1000;
  }

  function formatNaira(amount) {
    return `₦${Number(amount || 0).toLocaleString()}`;
  }

  global.FlightClass = {
    CLASSES,
    DEFAULT_CLASS,
    normalize,
    getSelected,
    setSelected,
    priceFor,
    formatNaira,
    info: (cls) => CLASSES[normalize(cls)],
  };
})(window);
