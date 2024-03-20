import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/tradersHub'

describe("QATEST-5699: Create a Financial Demo CFD account", () => {
  const signUpEmail = `sanity${generateEpoch()}mt5financialdemo@deriv.com`
  let country = Cypress.env("countries").CO

  beforeEach(() => {
    cy.c_setEndpoint(signUpEmail)
  })
  it("Verify I can signup for a demo financial CFD account", () => {
    cy.c_demoAccountSignup(country, signUpEmail)
    cy.c_checkTradersHubHomePage()
    cy.findAllByRole('button', { name: 'Get' }).eq(1).click()
    cy.findByText('Create a Deriv MT5 password').should('be.visible')
    cy.findByText(
      'You can use this password for all your Deriv MT5 accounts.'
    ).should('be.visible')
    cy.findByRole('button', { name: 'Create Deriv MT5 password' }).should(
      'be.disabled'
    )
    cy.findByTestId('dt_mt5_password').type(Cypress.env('mt5Password'), {
      log: false,
    })
    cy.findByRole('button', { name: 'Create Deriv MT5 password' }).click()
    cy.get('.dc-modal-body').should(
      'contain.text',
      'Success!Congratulations, you have successfully created your demo Deriv MT5 Financial account.'
    )
    cy.findByRole('button', { name: 'Continue' }).click()
    cy.findByText('10,000.00 USD').should('be.visible')
    cy.findByRole('button', { name: 'Top up' }).should('exist')
    cy.findByTestId('dt_trading-app-card_demo_financial_svg').findByRole('button', { name: 'Open' }).should('be.visible')
  })
})
