import '@testing-library/cypress/add-commands'
import { derivApp } from '../../../support/locators'

const toAccount = {
  type: 'Deriv MT5',
  subType: 'Derived',
  name: `${type} ${subType}`,
  code: 'SVG',
  delta: 0.001, // needed for approximately equal to
  accurateDelta: 0.0000001, // this for BTC to match exact exchangerate
}
const fromAccount = {
  type: 'Currency',
  subType: 'Fiat currencies',
  name: 'Euro',
  code: 'EUR',
  delta: 0.5, // needed for approximately equal to
  accurateDelta: 0.1,
}
const amountToTransfer = 10.0

const screenSizes = ['large', 'small']

screenSizes.forEach((screenSize) => {
  describe(`QATEST-20036 - Transfer: Perform Transfer from Fiat non-USD to MT5 in screen size: ${screenSize}`, () => {
    beforeEach(() => {
      cy.clearAllSessionStorage()
      cy.c_login({ user: 'cashierLegacy', rateLimit: 'check' })
      cy.c_visitResponsive('appstore/traders-hub', screenSize, {
        rateLimitCheck: true,
      })
      if (screenSize == 'small') {
        cy.findByRole('button', { name: 'Options & Multipliers' }).should(
          'be.visible'
        )
      } else {
        cy.findByText('Options & Multipliers').should('be.visible')
      }
      cy.c_closeNotificationHeader()
      cy.c_verifyActiveCurrencyAccount(fromAccount, { closeModalAtEnd: false })
      // cy.c_checkCurrencyAccountExists(toAccount, {
      //   modalAlreadyOpened: true,
      //   closeModalAtEnd: false,
      // })
      cy.then(() => {
        if (
          sessionStorage.getItem(`c_is${toAccount.code}AccountCreated`) ==
          'false'
        ) {
          cy.c_createNewCurrencyAccount(toAccount, { size: screenSize })
        } else if (
          sessionStorage.getItem(`c_is${toAccount.code}AccountCreated`) ==
          'true'
        ) {
          cy.c_closeModal()
        }
      })
      cy.c_getCurrencyBalance(fromAccount, { closeModalAtEnd: false })
      cy.c_getCurrencyBalance(toAccount, {
        modalAlreadyOpened: true,
        closeModalAtEnd: false,
      })
      cy.c_selectCurrency(fromAccount, { modalAlreadyOpened: true })
      cy.c_getCurrentCurrencyBalance()
    })
    it(`should transfer amount from fiat to crypto account.`, () => {
      cy.c_visitResponsive('/cashier/account-transfer/', screenSize, {
        rateLimitCheck: true,
      })
      cy.c_loadingCheck()
      cy.findByRole('heading', {
        name: 'Transfer between your accounts in Deriv',
      }).should('exist')
      cy.c_getCurrentExchangeRate(fromAccount.code, toAccount.code)
      cy.c_TransferBetweenAccounts({
        fromAccount: fromAccount,
        toAccount: toAccount,
        withExtraVerifications: true,
        transferAmount: amountToTransfer,
        size: screenSize,
      })
      if (screenSize == 'small') {
        derivApp.commonPage.mobileLocators.header.hamburgerMenuButton().click()
        derivApp.commonPage.mobileLocators.sideMenu.sidePanel().within(() => {
          derivApp.commonPage.mobileLocators.sideMenu.tradersHubButton().click()
        })
        cy.findByRole('button', { name: 'Options & Multipliers' }).should(
          'be.visible'
        )
      } else {
        derivApp.commonPage.desktopLocators.header.tradersHubButton().click()
        cy.findByText('Options & Multipliers').should('be.visible')
      }
      cy.get('.currency-switcher-container').within(() => {
        cy.findByTestId('dt_balance_text_container').should('be.visible')
      })
      cy.c_getCurrencyBalance(fromAccount, { closeModalAtEnd: false })
      cy.c_getCurrencyBalance(toAccount, {
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
            .getItem(`c_balance${fromAccount.code}`)
            .replace(/[^\d.]/g, '')
        )
        const currentBalanceToAccount = parseFloat(
          sessionStorage
            .getItem(`c_balance${toAccount.code}`)
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
        ).to.be.closeTo(estimatedFromAccountBalance, fromAccount.delta)
        expect(
          currentBalanceFromAccount,
          "From Currency Account's balance"
        ).to.be.closeTo(estimatedFromAccountBalance, fromAccount.delta)
        expect(
          currentBalanceToAccount,
          "To Currency Account's balance"
        ).to.be.closeTo(estimatedToAccountBalance, toAccount.delta)
      })
    })
  })
})
