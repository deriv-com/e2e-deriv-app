import { derivApp } from '../../../support/locators'

const toAccount = {
  type: 'Deriv MT5',
  subType: 'Standard',
  jurisdiction: 'SVG',
  fullJurisdiction: 'St. Vincent & Grenadines',
  name: 'Standard SVG',
  code: 'USD',
  delta: 2.0, // needed for approximately equal to
  largeValueDelta: 10,
  accurateDelta: 0.5, // this is to match exact exchangerate
}
const fromAccount = {
  type: 'Fiat currencies',
  name: 'US Dollar',
  code: 'USD',
  delta: 1, // needed for approximately equal to
  largeValueDelta: 5,
  accuratedelta: 0.5, // needed for approximately equal to
}
const fromAccountNonUSD = {
  type: 'Fiat currencies',
  name: 'Euro',
  code: 'EUR',
  delta: 2,
  largeValueDelta: 5,
  accurateDelta: 0.01, // needed for approximately equal to
}
const cryptoAccount = {
  type: 'Cryptocurrencies',
  name: 'Bitcoin',
  code: 'BTC',
  delta: 0.0001, // needed for approximately equal to
  largeValueDelta: 0.001,
  accurateDelta: 0.0000001, // this for BTc to match exact exchangerate
}
const amountToTransfer = 10.0
let isCitizenshipRemovedUSDAccount = false
let isCitizenshipRemovedNonUSDAccount = false

const screenSizes = ['desktop', 'small']

screenSizes.forEach((screenSize) => {
  describe(`QATEST-143444 - Transfer: Ensure client able to transfer when citizen field is empty in screen size: ${screenSize}`, () => {
    beforeEach(() => {
      cy.clearAllSessionStorage()
      let cypressContext = Cypress.currentTest.title
      Cypress.prevAppId = 0
      if (cypressContext.includes('Non USD Fiat')) {
        cy.c_login({
          user: 'cashierLegacyEurNonCitizenship',
          rateLimitCheck: true,
        })
      } else {
        cy.c_login({
          user: 'cashierLegacyNonCitizenship',
          rateLimitCheck: true,
        })
      }
      cy.c_visitResponsive('appstore/traders-hub', screenSize, {
        rateLimitCheck: true,
        skipPassKeys: true,
      })
      if (screenSize == 'small') {
        cy.findByRole('button', { name: 'CFDs' }).should('be.visible')
      } else {
        cy.findByText('CFDs').should('be.visible')
      }
      cy.c_loadingCheck()
      cy.c_closeNotificationHeader()
      cy.c_verifyActiveCurrencyAccount(
        cypressContext.includes('Non USD Fiat')
          ? fromAccountNonUSD
          : fromAccount,
        { closeModalAtEnd: false }
      )

      cy.c_getCurrencyBalance(
        cypressContext.includes('Non USD Fiat')
          ? fromAccountNonUSD
          : fromAccount,
        {
          modalAlreadyOpened: true,
          closeModalAtEnd: false,
        }
      )
      cy.c_checkCurrencyAccountExists(cryptoAccount, {
        modalAlreadyOpened: true,
        closeModalAtEnd: false,
      })
      cy.then(() => {
        if (
          sessionStorage.getItem(`c_is${cryptoAccount.code}AccountCreated`) ==
          'false'
        ) {
          cy.c_createNewCurrencyAccount(cryptoAccount, { size: screenSize })
        } else if (
          sessionStorage.getItem(`c_is${cryptoAccount.code}AccountCreated`) ==
          'true'
        ) {
          cy.c_closeModal()
        }
      })
      cy.c_getCurrencyBalance(cryptoAccount, {
        modalAlreadyOpened: false,
        closeModalAtEnd: false,
      })
      cy.c_selectCurrency(
        cypressContext.includes('Non USD Fiat')
          ? fromAccountNonUSD
          : fromAccount,
        { modalAlreadyOpened: true }
      )

      cy.c_getCurrentCurrencyBalance()
      if (
        (isCitizenshipRemovedUSDAccount == false &&
          !cypressContext.includes('Non USD Fiat')) ||
        (isCitizenshipRemovedNonUSDAccount == false &&
          cypressContext.includes('Non USD Fiat'))
      ) {
        if (cypressContext.includes('Non USD Fiat')) {
          cy.c_removeCRAccountCitizenship(
            Cypress.env('credentials').test.cashierLegacyEurNonCitizenship.ID,
            'EUR',
            'CR'
          )
        } else {
          cy.c_removeCRAccountCitizenship(
            Cypress.env('credentials').test.cashierLegacyNonCitizenship.ID,
            'USD',
            'CR'
          )
        }
        cy.c_visitResponsive('account/personal-details', screenSize)
        cy.c_loadingCheck()
        cy.findByTestId('dt_first_name').should('be.visible')
        cy.findByTestId('dt_citizen').should('not.exist')
        if (cypressContext.includes('Non USD Fiat')) {
          isCitizenshipRemovedNonUSDAccount = true
        } else {
          isCitizenshipRemovedUSDAccount = true
        }
        cy.c_visitResponsive('appstore/traders-hub', screenSize, {
          rateLimitCheck: true,
          skipPassKeys: true,
        })
      }
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
    it(`should transfer amount from USD Fiat to MT5 account.`, () => {
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
        sameCurrency: true,
      })
      if (screenSize == 'small') {
        derivApp.commonPage.mobileLocators.header.hamburgerMenuButton().click()
        derivApp.commonPage.mobileLocators.sideMenu.sidePanel().within(() => {
          derivApp.commonPage.mobileLocators.sideMenu.tradersHubButton().click()
        })
        cy.c_rateLimit()
        cy.findByRole('button', { name: 'CFDs' }).should('be.visible')
      } else {
        derivApp.commonPage.desktopLocators.header.tradersHubButton().click()
        cy.c_rateLimit()
        cy.findByText('CFDs').should('be.visible')
      }
      cy.c_checkTotalAssetSummary()
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
      cy.c_getCurrentExchangeRate(fromAccount.code, cryptoAccount.code)
      cy.c_TransferBetweenAccounts({
        fromAccount: fromAccount,
        toAccount: cryptoAccount,
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
      cy.c_getCurrencyBalance(cryptoAccount, {
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
            .getItem(`c_balance${cryptoAccount.code}`)
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
        ).to.be.closeTo(estimatedToAccountBalance, cryptoAccount.delta)
      })
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
      cy.c_getCurrentExchangeRate(fromAccountNonUSD.code, toAccount.code)
      cy.c_TransferBetweenAccounts({
        fromAccount: fromAccountNonUSD,
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
        cy.findByRole('button', { name: 'CFDs' }).should('be.visible')
      } else {
        derivApp.commonPage.desktopLocators.header.tradersHubButton().click()
        cy.c_rateLimit()
        cy.findByText('CFDs').should('be.visible')
      }
      cy.c_checkTotalAssetSummary()
      cy.get('.currency-switcher-container').within(() => {
        cy.findByTestId('dt_balance_text_container').should('be.visible')
      })
      cy.c_getCurrencyBalance(fromAccountNonUSD, { closeModalAtEnd: true })
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
          fromAccountNonUSD.type == 'Deriv MT5'
            ? parseFloat(
                sessionStorage
                  .getItem(
                    `c_balance${fromAccountNonUSD.subType}${fromAccountNonUSD.jurisdiction}`
                  )
                  .replace(/[^\d.]/g, '')
              )
            : parseFloat(
                sessionStorage
                  .getItem(`c_balance${fromAccountNonUSD.code}`)
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
        ).to.be.closeTo(estimatedFromAccountBalance, fromAccountNonUSD.delta)
        expect(
          currentBalanceFromAccount,
          "From Currency Account's balance"
        ).to.be.closeTo(estimatedFromAccountBalance, fromAccountNonUSD.delta)
        expect(
          currentBalanceToAccount,
          "To Currency Account's balance"
        ).to.be.closeTo(estimatedToAccountBalance, toAccount.delta)
      })
    })
  })
})
