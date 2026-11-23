/**
 * One job: Manage the optional ExchangeRate-API key settings panel.
 */
(function (App) {
  function createApiSettingsPanel({
    inputEl,
    saveBtn,
    clearBtn,
    modeTextEl,
    storage,
    onKeyChange
  }) {
    function renderMode() {
      const activeKey = storage.loadApiKey();
      if (activeKey) {
        inputEl.value = activeKey;
        modeTextEl.textContent =
          "Currently using: Authenticated ExchangeRate-API v6 Pair Endpoint";
      } else {
        inputEl.value = "";
        modeTextEl.textContent =
          "Currently using: Free Open Endpoint (no key required)";
      }
    }

    saveBtn.addEventListener("click", () => {
      storage.saveApiKey(inputEl.value);
      renderMode();
      onKeyChange();
    });

    clearBtn.addEventListener("click", () => {
      storage.clearApiKey();
      renderMode();
      onKeyChange();
    });

    renderMode();

    return { renderMode };
  }

  App.apiSettingsPanel = {
    create: createApiSettingsPanel
  };
})((window.CurrencyApp = window.CurrencyApp || {}));
