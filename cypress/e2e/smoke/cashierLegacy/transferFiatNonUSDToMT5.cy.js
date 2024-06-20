import { derivApp } from '../../../support/locators'

const toAccount = {
  type: 'Deriv MT5',
  subType: 'Standard',
  jurisdiction: 'SVG',
  fullJurisdiction: 'St. Vincent & Grenadines',
  name: 'Standard SVG',
  code: 'USD',
  delta: 1.5, // needed for approximately equal to
  accurateDelta: 0.5, // this is to match exact exchangerate
}
const fromAccount = {
  type: 'Fiat currencies',
  name: 'Euro',
  code: 'EUR',
  delta: 0.01, // needed for approximately equal to
}
const amountToTransfer = 10.0

const screenSizes = ['desktop', 'small']

screenSizes.forEach((screenSize) => {
  describe(`QATEST-34982 - Transfer: Perform Transfer from Fiat non-USD to MT5 in screen size: ${screenSize}`, () => {
    beforeEach(() => {
      cy.clearAllSessionStorage()
      cy.c_login({ user: 'cashierLegacyUSD', rateLimitCheck: true })
      cy.c_visitResponsive('appstore/traders-hub', screenSize, {
        rateLimitCheck: true,
        skipPassKeys: true,
      })
      if (screenSize == 'small') {
        cy.findByRole('button', { name: 'CFDs' }).should('be.visible')
      } else {
        cy.findByText('CFDs').should('be.visible')
      }
      cy.c_closeNotificationHeader()
      cy.c_verifyActiveCurrencyAccount(fromAccount, { closeModalAtEnd: false })
      cy.c_getCurrencyBalance(fromAccount, { modalAlreadyOpened: true })

      if (screenSize == 'small') {
        cy.findByRole('button', { name: 'CFDs' }).click()
      }
      cy.c_checkMt5AccountExists(toAccount)
      cy.then(() => {
        if (
          sessionStorage.getItem(
            `c_is${toAccount.subType}${toAccount.jurisdiction}AccountCreated`
          ) == 'false'
        ) {
          cy.c_createNewMt5Account(toAccount, { size: screenSize })
        }
      })
      cy.c_closeNotificationHeader()
      cy.c_getMt5AccountBalance(toAccount)
    })
    it(`should transfer amount from Non USD Fiat to MT5 account.`, () => {
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
      } else {
        derivApp.commonPage.desktopLocators.header.tradersHubButton().click()
        cy.findByText('CFDs').should('be.visible')
      }
      cy.get('.currency-switcher-container').within(() => {
        cy.findByTestId('dt_balance_text_container').should('be.visible')
      })
      cy.c_getCurrencyBalance(fromAccount, { closeModalAtEnd: true })
      cy.c_getCurrentCurrencyBalance()
      if (screenSize == 'small') {
        cy.findByRole('button', { name: 'CFDs' }).should('be.visible').click()
      }
      cy.c_getMt5AccountBalance(toAccount)

      cy.then(() => {
        const currentCurrencyBalance = parseFloat(
          sessionStorage
            .getItem(`c_currentCurrencyBalance`)
            .replace(/[^\d.]/g, '')
        )
        const currentBalanceFromAccount =
          fromAccount.type == 'Deriv MT5'
            ? parseFloat(
                sessionStorage
                  .getItem(
                    `c_balance${fromAccount.subType}${fromAccount.jurisdiction}`
                  )
                  .replace(/[^\d.]/g, '')
              )
            : parseFloat(
                sessionStorage
                  .getItem(`c_balance${fromAccount.code}`)
                  .replace(/[^\d.]/g, '')
              )
        const currentBalanceToAccount =
          toAccount.type == 'Deriv MT5'
            ? parseFloat(
                sessionStorage
                  .getItem(
                    `c_balance${toAccount.subType}${toAccount.jurisdiction}`
                  )
                  .replace(/[^\d.]/g, '')
              )
            : parseFloat(
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
