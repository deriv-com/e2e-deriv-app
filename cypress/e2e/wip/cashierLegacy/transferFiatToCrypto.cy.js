import '@testing-library/cypress/add-commands'
import { calculateTransferFee } from '../../../support/helper/utility'
import { derivApp } from '../../../support/locators'

const toCurrency = {
  name: 'Bitcoin',
  code: 'BTC',
}
const fromCurrency = {
  name: 'US Dollar',
  code: 'USD',
}

describe('QATEST-20036 - Transfer: Enter USD amount when Transfer Fiat to Crypto', () => {
  beforeEach(() => {
    cy.clearAllSessionStorage()
    cy.c_login()
    cy.c_visitResponsive('appstore/traders-hub', 'desktop')
    cy.findByText('Options & Multipliers').should('be.visible')
    cy.c_verifyActiveCurrencyAccount(fromCurrency, { closeModalAtEnd: false })
    cy.c_checkCurrencyAccountExists(toCurrency, {
      modalAlreadyOpened: true,
      closeModalAtEnd: false,
    })
    cy.then(() => {
      if (
        sessionStorage.getItem(`c_is${toCurrency.code}AccountCreated`) ==
        'false'
      ) {
        cy.c_createNewCurrencyAccount(toCurrency)
      } else if (
        sessionStorage.getItem(`c_is${toCurrency.code}AccountCreated`) == 'true'
      ) {
        cy.c_closeModal()
      }
    })
    cy.c_getCurrencyBalance(fromCurrency, { closeModalAtEnd: false })
    cy.c_getCurrencyBalance(toCurrency, {
      modalAlreadyOpened: true,
      closeModalAtEnd: false,
    })
    cy.c_selectCurrency(fromCurrency, { modalAlreadyOpened: true })
    cy.c_getCurrentCurrencyBalance()
  })
  it('should transfer amount from fiat to crypto account.', () => {
    cy.c_visitResponsive('/cashier/account-transfer/', 'desktop')
    cy.c_loadingCheck()
    cy.findByRole('heading', {
      name: 'Transfer between your accounts in Deriv',
    }).should('exist')
    cy.c_TransferBetweenAccounts({
      fromAccount: fromCurrency,
      toAccount: toCurrency,
      withExtraVerifications: true,
      transferAmount: 10,
    })
    derivApp.commonPage.desktopLocators.header.tradersHubButton().click()
    cy.findByText('Options & Multipliers').should('be.visible')
    cy.get('.currency-switcher-container').within(() => {
      cy.findByTestId('dt_balance_text_container').should('be.visible')
    })
    cy.c_getCurrencyBalance(fromCurrency, { closeModalAtEnd: false })
    cy.c_getCurrencyBalance(toCurrency, {
      modalAlreadyOpened: true,
      closeModalAtEnd: false,
    })
    cy.c_getCurrentCurrencyBalance()

    cy.then(() => {
      const currentCurrencyBalance = parseFloat(
        sessionStorage
          .getItem(`c_currentCurrencyBalance`)
          .replace(/[^\d.]/g, '')
      )
      const currentBalanceFromAccount = parseFloat(
        sessionStorage
          .getItem(`c_balance${fromCurrency.code}`)
          .replace(/[^\d.]/g, '')
      )
      const currentBalanceToAccount = parseFloat(
        sessionStorage
          .getItem(`c_balance${toCurrency.code}`)
          .replace(/[^\d.]/g, '')
      )
      const estimatedFromAccountBalance = parseFloat(
        sessionStorage.getItem('c_expectedFromAccountBalance')
      )
      const estimatedToAccountBalance = parseFloat(
        sessionStorage.getItem('c_expectedToAccountBalance')
      )

      expect(
        currentCurrencyBalance,
        "Current selected Currency Account's balance"
      ).to.be.closeTo(estimatedFromAccountBalance, 0.1)
      expect(
        currentBalanceFromAccount,
        "From Currency Account's balance"
      ).to.be.closeTo(estimatedFromAccountBalance, 0.1)
      expect(
        currentBalanceToAccount,
        "To Currency Account's balance"
      ).to.be.closeTo(estimatedToAccountBalance, 0.0001)
    })
  })
})
