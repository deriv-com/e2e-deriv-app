import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/tradersHub'

describe("QATEST-5569: Verify MF Signup flow", () => {
  const signUpEmail = `sanity${generateEpoch()}mf@deriv.com`
  let country = Cypress.env("countries").ES
  let nationalIDNum = Cypress.env("nationalIDNum").ES
  let taxIDNum = Cypress.env("taxIDNum").ES
  let currency = Cypress.env("accountCurrency").GBP

  beforeEach(() => {
    cy.c_setEndpoint(signUpMail)
  })
  it("Verify I can signup for an MF demo and real account", () => {
    cy.c_demoAccountSignup(country,signUpEmail)
    cy.c_generateRandomName().then((firstName) => {
      cy.c_personalDetails(
        firstName,
        'MF',
        country,
        nationalIDNum,
        taxIDNum,
        currency
      )
    })
    cy.c_addressDetails()
    cy.c_completeTradingAssessment()
    cy.c_completeFinancialAssessment()
    cy.c_completeFatcaDeclarationAgreement()
    cy.c_addAccountMF()
    cy.get('#traders-hub').scrollIntoView({ position: 'top' })
    cy.findByText('Total assets').should('be.visible')
    cy.findByText('0.00').should('be.visible')
    cy.c_manageAccountsetting(country)
  })
})
