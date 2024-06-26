import { derivApp } from '../../../support/locators'

const toAccount = {
  type: 'Cryptocurrencies',
  name: 'Bitcoin',
  code: 'BTC',
  delta: 0.0001, // needed for approximately equal to
  largeValueDelta: 0.001,
  accurateDelta: 0.0000001, // this for BTc to match exact exchangerate
}
const fromAccount = {
  type: 'Fiat currencies',
  name: 'US Dollar',
  code: 'USD',
  delta: 1, // needed for approximately equal to
  largeValueDelta: 5,
  accuratedelta: 0.5, // needed for approximately equal to
}
const amountToTransfer = 10.0

const screenSizes = ['large', 'small']

screenSizes.forEach((screenSize) => {
  describe(`QATEST-20036 - Transfer: Enter USD amount when Transfer Fiat to Crypto in screen size: ${screenSize}`, () => {
    beforeEach(() => {
      cy.clearAllSessionStorage()
      cy.c_login({ user: 'cashierLegacy', rateLimitCheck: true })
      cy.c_visitResponsive('appstore/traders-hub', screenSize, {
        rateLimitCheck: true,
        skipPassKeys: true,
      })
      if (screenSize == 'small') {
        cy.findByRole('button', { name: 'Options' }).should('be.visible')
      } else {
        cy.findByText('Options').should('be.visible')
      }
      cy.c_loadingCheck()
      cy.c_closeNotificationHeader()
      cy.c_verifyActiveCurrencyAccount(fromAccount, { closeModalAtEnd: false })
      cy.c_checkCurrencyAccountExists(toAccount, {
        modalAlreadyOpened: true,
        closeModalAtEnd: false,
      })
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
    it(`should transfer amount from Fiat to Crypto account.`, () => {
      cy.c_visitResponsive('/cashier/account-transfer/', screenSize, {
        rateLimitCheck: true,
      })
      cy.c_loadingCheck()
      cy.c_rateLimit({
        waitTimeAfterError: 15000,
        maxRetries: 5,
      })
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
        cy.c_rateLimit()
        cy.findByRole('button', { name: 'Options' }).should('be.visible')
      } else {
        derivApp.commonPage.desktopLocators.header.tradersHubButton().click()
        cy.c_rateLimit()
        cy.findByText('Options').should('be.visible')
      }
      cy.c_checkTotalAssetSummary()
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
