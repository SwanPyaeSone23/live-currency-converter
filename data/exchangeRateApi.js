/**
 * One job: Fetch real-time exchange rates from ExchangeRate-API using the Fetch API.
 */
(function (App) {
  /**
   * Builds the ExchangeRate-API URL.
   * - With an API key: uses the authenticated v6 pair endpoint.
   * - Without an API key: uses ExchangeRate-API's free open endpoint.
   */
  function buildRateUrl(from, to, apiKey) {
    if (apiKey) {
      return `https://v6.exchangerate-api.com/v6/${encodeURIComponent(apiKey)}/pair/${from}/${to}`;
    }
    return `https://open.er-api.com/v6/latest/${from}`;
  }

  /**
   * Fetches the conversion rate between two currencies.
   *
   * @param {string} from - Source currency code (e.g., "USD")
   * @param {string} to - Target currency code (e.g., "EUR")
   * @param {{ apiKey?: string, signal?: AbortSignal }} [options]
   * @returns {Promise<{ rate: number, updatedAtUtc: string | null }>}
   */
  async function fetchExchangeRate(from, to, options = {}) {
    const { apiKey = "", signal } = options;
    const url = buildRateUrl(from, to, apiKey);

    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`API responded with HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.result !== "success") {
      const apiError = data["error-type"] || "unknown_error";
      throw new Error(`ExchangeRate-API error: ${apiError}`);
    }

    // Authenticated v6 pair endpoint returns `conversion_rate`;
    // Free open endpoint returns `rates[to]`.
    const rate =
      typeof data.conversion_rate === "number"
        ? data.conversion_rate
        : data.rates?.[to];

    if (typeof rate !== "number") {
      throw new Error(`Exchange rate unavailable for ${from} → ${to}`);
    }

    return {
      rate,
      updatedAtUtc: data.time_last_update_utc || null
    };
  }

  App.exchangeRateApi = {
    buildRateUrl,
    fetchExchangeRate
  };
})((window.CurrencyApp = window.CurrencyApp || {}));
