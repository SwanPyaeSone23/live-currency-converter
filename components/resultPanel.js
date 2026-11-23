/**
 * One job: Render the conversion result, unit/inverse rates, loading state, and error banner.
 */
(function (App) {
  function createResultPanel({
    resultEl,
    unitRateEl,
    inverseRateEl,
    refreshBtn,
    errorBanner,
    lastUpdatedEl
  }) {
    const { formatAmount, formatRate, formatUpdatedTime } = App.formatters;

    function setLoading(isLoading) {
      resultEl.classList.toggle("is-loading", isLoading);
      refreshBtn.classList.toggle("spinning", isLoading);
    }

    function showError(message) {
      if (message) {
        errorBanner.textContent = message;
        errorBanner.hidden = false;
      } else {
        errorBanner.textContent = "";
        errorBanner.hidden = true;
      }
    }

    function showConversion({ amount, from, to, rate, updatedAtUtc }) {
      const converted = amount * rate;
      const inverse = 1 / rate;

      resultEl.innerText = `${formatAmount(amount, 2)} ${from} = ${formatAmount(converted, 2)} ${to}`;
      unitRateEl.textContent = `1 ${from} = ${formatRate(rate)} ${to}`;
      inverseRateEl.textContent = `1 ${to} = ${formatRate(inverse)} ${from}`;

      if (updatedAtUtc) {
        lastUpdatedEl.textContent = `Rates updated: ${formatUpdatedTime(updatedAtUtc)}`;
      }
    }

    function showInvalidAmount() {
      showError("Please enter a valid non-negative amount.");
      resultEl.innerText = "Enter a valid amount";
    }

    return {
      setLoading,
      showError,
      showConversion,
      showInvalidAmount
    };
  }

  App.resultPanel = {
    create: createResultPanel
  };
})((window.CurrencyApp = window.CurrencyApp || {}));
