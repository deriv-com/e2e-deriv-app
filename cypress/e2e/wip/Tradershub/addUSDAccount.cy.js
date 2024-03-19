import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/tradersHub'

  describe("QATEST 5813 - Add USD account for existing BTC account", () => {
    const signUpEmail = `sanity${generateEpoch()}crypto@deriv.com`
    let country = Cypress.env("countries").CO
    let nationalIDNum = Cypress.env("nationalIDNum").CO
    let taxIDNum = Cypress.env("taxIDNum").CO
    let currency = Cypress.env("accountCurrency").BTC
  
    beforeEach(() => {
      cy.c_setEndpoint(signUpMail)
    })
    it("Create a new crypto account and add USD account", () => {
      
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
    cy.c_completeFatcaDeclarationAgreement()
    cy.c_addAccount()
    cy.c_checkTradersHubHomePage()
    cy.c_closeNotificationHeader()
    cy.findByTestId('dt_currency-switcher__arrow').click()
    cy.findByRole('button', { name: 'Add or manage account' }).click()
    cy.findByText('Fiat currencies').click()
    cy.findByText('US Dollar').click()
    cy.findByRole('button', { name: 'Add account' }).click()
    cy.findByRole('heading', { name: 'Success!' }).should('be.visible', {
      timeout: 30000,
    })
    cy.findByText('You have added a USD account.').should('be.visible')
    cy.findByRole('button', { name: 'Maybe later' }).click()
  })
})
