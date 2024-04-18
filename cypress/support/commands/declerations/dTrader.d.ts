export {}
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select a symbol
       * @param symobolName Name of the symbol which you want to select
       * @example c_selectSymbol('Volatility 100 (1s) Index')
       */
      c_selectSymbol(symobolName: String): void

      /**
       * Custom command to select any trade type
       * @param category Category name
       * @param tradeType Trade type which you want to select
       * @example     cy.c_selectTradeType('Options', 'Over/Under')
       */
      c_selectTradeType(category: String, tradeType: String): void

      /**
       * Custom command to check if ticks are changing for a symbol after a given duration
       * @example cy.c_checkSymbolTickChange(5000)
       */
      c_checkSymbolTickChange(duration: Number): void

      /**
       * Remove it. No need for a command for a single action
       * Replace with cy.findByRole('button', { name: 'Stake' }).click()
       */
      c_selectStakeTab(): void

      /**
       * Remove it. No need for a command for a single action
       * Replace with cy.findByRole('button', { name: 'Payout' }).click()
       */
      c_selectPayoutTab(): void

      /**
       * Custom command to select the number of ticks for a contract
       * @param tickDuration Number of ticks
       * @example cy.c_selectTickDuration(4)
       */
      c_selectTickDuration(tickDuration: Number): void

      /**
       * Custom command to validate the available duration types for a trade type
       * @param tradetype Trade type name
       * @example cy.c_validateDurationDigits('Matches/Differs')
       */
      c_validateDurationDigits(tradetype: String): void

      /**
       * Custom command to verify that stake value does not equal to payout value
       * @param tradeType Trade type name
       * @param tradeTypeParentLocator Parent locator for Stake and Payout amount
       * @example cy.c_matchStakePayoutValue('Matches/Differs','#dt_purchase_digitmatch_price')
       */
      c_matchStakePayoutValue(
        tradeType: String,
        tradeTypeParentLocator: String
      ): void

      /**
       * Custom command to validate available data on the Trade Table on Reports page for given buy reference ID
       * It will match if the input reference ID is present on the Trade Table
       * @param buyReference Buy reference ID of the contract
       * @example cy.c_checkTradeTablePage(1234567890)
       */
      c_checkTradeTablePage(buyReference: String): void

      /**
       * Custom command to validate available data on the statement page for given buy and sell reference IDs
       * It will match if the input reference IDs are present on the statement page
       * @param buyReference Buy reference ID of the contract
       * @param sellReference Sell reference ID of the contract
       * @example cy.c_checkStatementPage(1234567890)
       */
      c_checkStatementPage(buyReference: String, sellReference: String): void

      /**
       * Custom command to validate the contract details page for input trade type
       * @param tradeType Trade type name
       * @param stakeAmount Stake amount
       * @param tickDuration Tick duration
       * @example cy.c_checkContractDetailsPage('Matches/Differs','10.00',4)
       */
      c_checkContractDetailsPage(
        tradeType: String,
        stakeAmount: String,
        tickDuration: Number
      ): void

      /**
       * Custom command to compare the difference between two images and pass if both images are different
       * @param elementSelector Locator for the element which you want to compare
       * @param imageName1 Name of the first image
       * @param imageName2 Name of the second image
       * @param diffImageName Name of the third image (which captures the difference)
       * @example cy.c_compareElementScreenshots('.flutter-chart', 'initial-state','updated-state','diff-state')
       */
      c_compareElementScreenshots(
        elementSelector: String,
        imageName1: String,
        imageName2: String,
        diffImageName: String
      ): void
    }
  }
}
