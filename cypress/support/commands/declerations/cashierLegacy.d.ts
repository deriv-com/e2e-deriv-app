declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Performs a transfer between two accounts, with optional verifications and a specified transfer amount.
       * @example
       * cy.c_TransferBetweenAccounts({
       *   fromAccount: { code: 'USD', name: 'US Dollar Account' },
       *   toAccount: { code: 'EUR', name: 'Euro Account' },
       *   withExtraVerifications: true,
       *   transferAmount: 100
       * });
       *
       * @example
       * cy.c_TransferBetweenAccounts({
       *   fromAccount: { code: 'BTC', name: 'Bitcoin Wallet' },
       *   toAccount: { code: 'ETH', name: 'Ethereum Wallet' },
       *   withExtraVerifications: false,
       *   transferAmount: 0.05
       * });
       */
      c_TransferBetweenAccounts(options?: TransferOptions): Chainable<void>

      /**
       * Verifies the functionality of the percentage selector section in the UI.
       * @example
       * cy.c_verifypercentageSelectorSection({ withCurrency: '1000 USD', withoutCurrency: 1000 });
       *
       * @example
       * cy.c_verifypercentageSelectorSection({ withCurrency: '0.5 BTC', withoutCurrency: 0.5 });
       */
      c_verifypercentageSelectorSection(
        fromAccountBalance: Balance
      ): Chainable<void>

      /**
       * Checks the conversion section of the transfer UI for correct operation and validation.
       * @example
       * cy.c_verifyConvertorSection({ withCurrency: '2500 EUR', withoutCurrency: 2500 }, {
       *   fromAccount: { code: 'EUR', name: 'Euro Account' },
       *   toAccount: { code: 'USD', name: 'US Dollar Account' }
       * });
       *
       * @example
       * cy.c_verifyConvertorSection({ withCurrency: '1.2 ETH', withoutCurrency: 1.2 }, {
       *   fromAccount: { code: 'ETH', name: 'Ethereum Wallet' },
       *   toAccount: { code: 'BTC', name: 'Bitcoin Wallet' }
       * });
       */
      c_verifyConvertorSection(
        fromAccountBalance: Balance,
        options?: TransferOptions
      ): Chainable<void>
    }
  }
}

export {}
