// Import Cypress types
/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Checks if a currency account already exists and saves values as true or false in session Storage.
       * @param currency Object containing currency name and code.
       * @param options Object with flags to control modal behavior.
       * @example
       * cy.c_checkCurrencyAccountExists({ name: "US Dollar", code: "USD" });
       * @example
       * cy.c_checkCurrencyAccountExists({ name: "US Dollar", code: "USD" }, { closeModalAtEnd: false });
       * @example
       * cy.c_checkCurrencyAccountExists({ name: "Euro", code: "EUR" }, { closeModalAtEnd: true, modalAlreadyOpened: true });
       */
      c_checkCurrencyAccountExists(
        currency: { name: string; code: string },
        options?: { closeModalAtEnd?: boolean; modalAlreadyOpened?: boolean }
      ): Chainable<void>

      /**
       * Retrieves the balance for a specified currency account into Session Storage for the currency passed as "1999.03 USD".
       * @param currency Object containing currency name and code.
       * @param options Object with flags to control modal behavior.
       * @example
       * cy.c_getCurrencyBalance({ name: "Euro", code: "EUR" });
       * @example
       * cy.c_getCurrencyBalance({ name: "US Dollar", code: "USD" }, { closeModalAtEnd: false });
       * @example
       * cy.c_getCurrencyBalance({ name: "Japanese Yen", code: "JPY" }, { closeModalAtEnd: true, modalAlreadyOpened: true });
       */
      c_getCurrencyBalance(
        currency: { name: string; code: string },
        options?: { closeModalAtEnd?: boolean; modalAlreadyOpened?: boolean }
      ): Chainable<void>

      /**
       * Creates a new currency account.
       * @param currency Object containing currency name and code.
       * @example
       * cy.c_createNewCurrencyAccount({ name: "British Pound", code: "GBP" });
       */
      c_createNewCurrencyAccount(currency: {
        name: string
        code: string
      }): Chainable<void>

      /**
       * Opens the currency account selector modal.
       * @example
       * cy.c_openCurrencyAccountSelector();
       */
      c_openCurrencyAccountSelector(): Chainable<void>

      /**
       * Selects a specified currency account.
       * @param currency Object containing currency name and code.
       * @param options Object with flag to check if modal is already opened.
       * @example
       * cy.c_selectCurrency({ name: "Japanese Yen", code: "JPY" });
       * @example
       * cy.c_selectCurrency({ name: "Australian Dollar", code: "AUD" }, { modalAlreadyOpened: true });
       * @example
       * cy.c_selectCurrency({ name: "British Pound", code: "GBP" }, { modalAlreadyOpened: false });
       */
      c_selectCurrency(
        currency: { name: string; code: string },
        options?: { modalAlreadyOpened?: boolean }
      ): Chainable<void>

      /**
       * Verifies if the specified currency account is the active account.
       * @param currency Object containing currency name and code.
       * @param options Object with flags to control modal behavior.
       * @example
       * cy.c_verifyActiveCurrencyAccount({ name: "Australian Dollar", code: "AUD" });
       * @example
       * cy.c_verifyActiveCurrencyAccount({ name: "US Dollar", code: "USD" }, { closeModalAtEnd: false });
       * @example
       * cy.c_verifyActiveCurrencyAccount({ name: "Euro", code: "EUR" }, { closeModalAtEnd: true, modalAlreadyOpened: true });
       */
      c_verifyActiveCurrencyAccount(
        currency: { name: string; code: string },
        options?: { closeModalAtEnd?: boolean; modalAlreadyOpened?: boolean }
      ): Chainable<void>

      /**
       * Retrieves the current active currency account's balance and stores in the session Storage as "999.99 USD".
       * @example
       * cy.c_getCurrentCurrencyBalance();
       */
      c_getCurrentCurrencyBalance(): Chainable<void>
    }
  }
}

export {}
