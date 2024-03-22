import '@testing-library/cypress/add-commands'
import cryptoconfig from './pageobjects/common.js'
import { generateEpoch } from '../../../support/tradersHub'


const addcryptoaccount = (crypto, code) => {
  cryptoconfig.elements.currencyswitcher().should('be.visible').click()
  cryptoconfig.elements.manageaccount().should('be.visible').click()
  cy.get('.add-crypto-currency').then(($parent) => {
    const $input = $parent.find(`input[name="currency"][id="${code}"][disabled]`)
    if ($input.length > 0) {
      // Element is disabled
      cy.log(`${code} input element is disabled.`)
      cy.get('.dc-modal-header__close').click()
      cy.c_closeNotificationHeader()
    } else {
      // Element is not disabled
      cy.c_closeNotificationHeader()
      cy.findByText(crypto).click()
      cryptoconfig.elements.cryptoaddaccount().should('be.visible').click()
      cy.findByText('Success!')
      cy.findByText('Make a deposit now to start trading.')
      cryptoconfig.elements.maybelater().should('be.visible').click()
    }})
  return crypto
};

describe('QATEST-707 - Create crypto account', () => {
  const signUpEmail = `sanity${generateEpoch()}crypto@deriv.com`
  let country = Cypress.env("countries").CO
  let nationalIDNum = Cypress.env("nationalIDNum").CO
  let taxIDNum = Cypress.env("taxIDNum").CO
  let currency = Cypress.env("accountCurrency").USD
  beforeEach(() => {
    cy.c_setEndpoint(signUpEmail)
  })
  it('should be able to create crypto account from Traders Hub.', () => {
    cy.c_demoAccountSignup(country, signUpEmail)
    cy.c_switchToReal()
    cy.c_completeTradersHubTour()
    cy.findByRole("button", { name: "Get a Deriv account" }).click()
    cy.c_generateRandomName().then((firstName) => {
    cy.c_personalDetails(
          firstName,
          "Onfido",
          country,
          nationalIDNum,
          taxIDNum,
          currency
        )
      })
   cy.c_addressDetails()
   cy .c_completeFatcaDeclarationAgreement()
   cy.c_addAccount()
   cy.c_checkTradersHubHomePage()
   cy.c_closeNotificationHeader()
    const cryptocurrencies = ["Bitcoin", "Ethereum", "Litecoin", "Tether TRC20", "USD Coin"]
    const currency_code = ["BTC", "ETH", "LTC", "tUSDT", "USDC"]
    // loop to make sure it check for all available currency
    cryptocurrencies.forEach((crypto, index) => {
        const code = currency_code[index]
        addcryptoaccount(crypto, code)
    });
    // to check for the account balance after creation
      cryptoconfig.elements.currencyswitcher().should('be.visible').click();
      cy.findByText("0.00000000 BTC").should("be.visible")
      cy.findByText("0.00000000 ETH").should("be.visible")
      cy.findByText("0.00000000 LTC").should("be.visible")
      cy.findByText("0.00 tUSDT").should("be.visible")
      cy.findByText("0.00 USDC").should("be.visible") 
});
  })