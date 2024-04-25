import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/helper/utility'

describe('QATEST-5569: Verify MF Signup flow', () => {
  let size = ['small', 'desktop']
  const signUpEmail = `sanity${generateEpoch()}mf@deriv.com`
  let country = Cypress.env('countries').ES
  let nationalIDNum = Cypress.env('nationalIDNum').ES
  let taxIDNum = Cypress.env('taxIDNum').ES
  let currency = Cypress.env('accountCurrency').EUR

  size.forEach((size) => {
    it(`Verify I can signup for an MF demo and real account ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      cy.c_setEndpoint(signUpEmail, size)
      cy.c_demoAccountSignup(country, signUpEmail, size)
      cy.c_generateRandomName().then((firstName) => {
        cy.c_personalDetails(
          firstName,
          'MF',
          country,
          nationalIDNum,
          taxIDNum,
          currency,
          { isMobile: size == 'small' ? true : false }
        )
      })
      cy.c_addressDetails()
      cy.c_completeTradingAssessment()
      cy.c_completeFinancialAssessment()
      cy.c_completeFatcaDeclarationAgreement()
      cy.c_addAccountMF('MF')
      cy.get('#traders-hub').scrollIntoView({ position: 'top' })
      cy.findByText('Total assets').should('be.visible')
      cy.findByText('0.00').should('be.visible')
      cy.c_manageAccountsetting(country)
    })
  })
})
