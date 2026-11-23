# Live Currency Converter

A beginner-friendly web app that converts between 40 world currencies using real-time rates from **ExchangeRate-API**, built with vanilla **JavaScript (Fetch API)** and **CSS Flexbox**.

## Folder Structure (One Job Per File)

```text
Live Currency Converter/
├── index.html                    # Entry HTML page
├── data/                         # Saving, loading, and API fetching
│   ├── currencies.js             # List of 40 world currencies + lookup helper
│   ├── settingsStorage.js        # Saves/loads optional API key & last pair in localStorage
│   └── exchangeRateApi.js        # Calls ExchangeRate-API using async/await Fetch API
├── components/                   # Reusable UI pieces
│   ├── formatters.js             # Formats amounts, exchange rates, and timestamps
│   ├── currencyDropdown.js       # Populates currency <select> menus
│   ├── statusBadge.js            # Updates the header status pill
│   ├── resultPanel.js            # Renders conversion results, rates, and errors
│   ├── apiSettingsPanel.js       # Handles the optional API key settings drawer
│   ├── inputs.css                # Styles for inputs, dropdowns, chips, and buttons
│   └── panels.css                # Styles for the status pill, result panel, and drawer
└── pages/                        # Screens
    ├── converterPage.js          # Wires up the Converter screen interactions
    └── converterPage.css         # Theme variables & Flexbox page layout
```

Every file has one clear job and stays well under 300 lines.

## Getting Started

1. Open `index.html` directly in your browser, or run a local server:
   ```bash
   python3 -m http.server 8000
   ```
2. Type an amount and pick your **From** and **To** currencies. Your last selected pair is saved automatically.

## Using Your Own ExchangeRate-API Key (Optional)

1. Get a free API key at [exchangerate-api.com](https://www.exchangerate-api.com/).
2. Open **"Configure ExchangeRate-API Key (Optional)"** at the bottom of the app and save your key (or set `DEFAULT_API_KEY` in `data/settingsStorage.js`).
3. The app will automatically switch to:
   ```text
   https://v6.exchangerate-api.com/v6/{API_KEY}/pair/{from}/{to}
   ```
