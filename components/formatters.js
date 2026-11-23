/**
 * One job: Format currency amounts, exchange rates, and timestamps for display.
 */
(function (App) {
  function formatAmount(value, maxDecimals = 2) {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxDecimals
    }).format(value);
  }

  function formatRate(rate) {
    if (!Number.isFinite(rate)) return "—";
    const maxDecimals = rate < 0.01 ? 6 : 4;
    return formatAmount(rate, maxDecimals);
  }

  function formatUpdatedTime(utcString) {
    if (!utcString) return "—";
    const date = new Date(utcString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }

  App.formatters = {
    formatAmount,
    formatRate,
    formatUpdatedTime
  };
})((window.CurrencyApp = window.CurrencyApp || {}));
