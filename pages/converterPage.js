/**
 * One job: Wire up the Live Currency Converter screen (user events, swap, and live rate updates).
 */
(function (App) {
  const amountInput = document.getElementById("amount");
  const fromSelect = document.getElementById("fromCurrency");
  const toSelect = document.getElementById("toCurrency");
  const fromSymbolEl = document.getElementById("fromSymbol");
  const swapBtn = document.getElementById("swapBtn");
  const refreshBtn = document.getElementById("refreshBtn");

  const statusBadge = App.statusBadge.create({
    pillEl: document.getElementById("statusPill"),
    textEl: document.getElementById("statusText")
  });

  const resultPanel = App.resultPanel.create({
    resultEl: document.getElementById("result"),
    unitRateEl: document.getElementById("unitRate"),
    inverseRateEl: document.getElementById("inverseRate"),
    refreshBtn,
    errorBanner: document.getElementById("errorBanner"),
    lastUpdatedEl: document.getElementById("lastUpdated")
  });

  let activeController = null;
  let debounceTimer = null;

  function updateCurrencySymbol() {
    const currency = App.currencies.getByCode(fromSelect.value);
    fromSymbolEl.textContent = currency ? currency.symbol : "$";
  }

  /**
   * Fetches the exchange rate for (from -> to) and displays the converted amount.
   */
  async function getExchangeRate(from, to, amount) {
    if (!Number.isFinite(amount) || amount < 0) {
      resultPanel.showInvalidAmount();
      return;
    }

    if (from === to) {
      resultPanel.showError("");
      resultPanel.setLoading(false);
      statusBadge.setState("ready", "Live Rates");
      resultPanel.showConversion({ amount, from, to, rate: 1, updatedAtUtc: null });
      return;
    }

    if (activeController) {
      activeController.abort();
    }
    activeController = new AbortController();

    statusBadge.setState("loading", "Updating...");
    resultPanel.setLoading(true);
    resultPanel.showError("");

    try {
      const apiKey = App.settingsStorage.loadApiKey();
      const { rate, updatedAtUtc } = await App.exchangeRateApi.fetchExchangeRate(
        from,
        to,
        { apiKey, signal: activeController.signal }
      );

      resultPanel.showConversion({ amount, from, to, rate, updatedAtUtc });
      statusBadge.setState("ready", "Live Rates");
    } catch (error) {
      if (error.name === "AbortError") return;

      console.error("Error fetching rates:", error);
      statusBadge.setState("error", "Rate Error");
      resultPanel.showError(
        error.message.includes("invalid-key")
          ? "Invalid ExchangeRate-API key. Check your key or click Use Free."
          : `Could not fetch live rates (${error.message}). Check your connection and try again.`
      );
    } finally {
      resultPanel.setLoading(false);
    }
  }

  function convertNow() {
    const from = fromSelect.value;
    const to = toSelect.value;
    const raw = amountInput.value.trim();
    const amount = raw === "" ? 0 : parseFloat(raw);
    App.settingsStorage.saveLastPair(from, to);
    getExchangeRate(from, to, amount);
  }

  function handleAmountInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(convertNow, 250);
  }

  function swapCurrencies() {
    const previousFrom = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = previousFrom;

    swapBtn.classList.toggle("rotated");
    updateCurrencySymbol();
    convertNow();
  }

  function initConverterPage() {
    const savedPair = App.settingsStorage.loadLastPair();

    App.currencyDropdown.populate(fromSelect, App.currencies.list, savedPair.from);
    App.currencyDropdown.populate(toSelect, App.currencies.list, savedPair.to);
    updateCurrencySymbol();

    App.apiSettingsPanel.create({
      inputEl: document.getElementById("apiKeyInput"),
      saveBtn: document.getElementById("saveKeyBtn"),
      clearBtn: document.getElementById("clearKeyBtn"),
      modeTextEl: document.getElementById("apiModeText"),
      storage: App.settingsStorage,
      onKeyChange: convertNow
    });

    amountInput.addEventListener("input", handleAmountInput);
    fromSelect.addEventListener("change", () => {
      updateCurrencySymbol();
      convertNow();
    });
    toSelect.addEventListener("change", convertNow);
    swapBtn.addEventListener("click", swapCurrencies);
    refreshBtn.addEventListener("click", convertNow);

    document.querySelectorAll(".chip").forEach((button) => {
      button.addEventListener("click", () => {
        amountInput.value = button.dataset.amount;
        convertNow();
      });
    });

    document.querySelectorAll(".pair-btn").forEach((button) => {
      button.addEventListener("click", () => {
        fromSelect.value = button.dataset.from;
        toSelect.value = button.dataset.to;
        updateCurrencySymbol();
        convertNow();
      });
    });

    convertNow();
  }

  App.converterPage = { init: initConverterPage, getExchangeRate };
  initConverterPage();
})((window.CurrencyApp = window.CurrencyApp || {}));
