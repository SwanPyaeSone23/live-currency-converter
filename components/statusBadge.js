/**
 * One job: Update the connection status pill in the header.
 */
(function (App) {
  function createStatusBadge({ pillEl, textEl }) {
    function setState(state, message) {
      pillEl.classList.remove("loading", "error");
      if (state === "loading") pillEl.classList.add("loading");
      if (state === "error") pillEl.classList.add("error");
      textEl.textContent = message;
    }

    return { setState };
  }

  App.statusBadge = {
    create: createStatusBadge
  };
})((window.CurrencyApp = window.CurrencyApp || {}));
