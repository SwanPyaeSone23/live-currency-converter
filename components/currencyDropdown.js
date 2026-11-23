/**
 * One job: Populate a <select> dropdown with the list of world currencies.
 */
(function (App) {
  function populateCurrencyDropdown(selectElement, currencies, defaultCode) {
    const fragment = document.createDocumentFragment();

    currencies.forEach(({ code, name, flag }) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = `${flag} ${code} — ${name}`;
      fragment.appendChild(option);
    });

    selectElement.textContent = "";
    selectElement.appendChild(fragment);

    if (defaultCode) {
      selectElement.value = defaultCode;
    }
  }

  App.currencyDropdown = {
    populate: populateCurrencyDropdown
  };
})((window.CurrencyApp = window.CurrencyApp || {}));
