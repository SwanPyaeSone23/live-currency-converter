/**
 * One job: Save and load user settings (API key and last currency pair) in localStorage.
 */
(function (App) {
  const DEFAULT_API_KEY = "your_api_key";
  const API_KEY_STORAGE = "live_currency_converter_api_key";
  const PAIR_STORAGE = "live_currency_converter_last_pair";

  function loadApiKey() {
    const saved = localStorage.getItem(API_KEY_STORAGE)?.trim();
    if (saved) return saved;
    if (DEFAULT_API_KEY && DEFAULT_API_KEY !== "your_api_key") {
      return DEFAULT_API_KEY.trim();
    }
    return "";
  }

  function saveApiKey(key) {
    const cleaned = (key || "").trim();
    if (!cleaned) {
      localStorage.removeItem(API_KEY_STORAGE);
    } else {
      localStorage.setItem(API_KEY_STORAGE, cleaned);
    }
  }

  function clearApiKey() {
    localStorage.removeItem(API_KEY_STORAGE);
  }

  function loadLastPair() {
    try {
      const raw = localStorage.getItem(PAIR_STORAGE);
      if (!raw) return { from: "USD", to: "EUR" };
      const parsed = JSON.parse(raw);
      return {
        from: parsed.from || "USD",
        to: parsed.to || "EUR"
      };
    } catch {
      return { from: "USD", to: "EUR" };
    }
  }

  function saveLastPair(from, to) {
    localStorage.setItem(PAIR_STORAGE, JSON.stringify({ from, to }));
  }

  App.settingsStorage = {
    loadApiKey,
    saveApiKey,
    clearApiKey,
    loadLastPair,
    saveLastPair
  };
})((window.CurrencyApp = window.CurrencyApp || {}));
