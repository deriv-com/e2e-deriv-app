import { generateEpoch } from '../../../support/helper/utility'

describe('QATEST-5569: Verify MF Signup flow', () => {
  let size = ['small', 'desktop']
  let country = Cypress.env('countries').ES
  let nationalIDNum = Cypress.env('nationalIDNum').ES
  let taxIDNum = Cypress.env('taxIDNum').ES
  let currency = Cypress.env('accountCurrency').EUR

  size.forEach((size) => {
    it(`Verify I can signup for an MF demo and real account on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      const signUpEmail = `sanity${generateEpoch()}mf@deriv.com`
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
          { isMobile: isMobile }
        )
      })
      cy.c_addressDetails()
      cy.c_completeTradingAssessment({
        isMobile: isMobile,
      })
      cy.c_completeFinancialAssessment({
        isMobile: isMobile,
      })
      cy.c_completeFatcaDeclarationAgreement()
      cy.c_addAccountMF('MF', { isMobile: isMobile })
      if (size == 'desktop') {
        cy.get('#traders-hub').scrollIntoView({ position: 'top' })
        cy.findByText('Total assets').should('be.visible')
      }
      cy.findByTestId('dt_balance_text_container').should(
        'have.text',
        '0.00EUR'
      )
      cy.c_manageAccountsetting(country, {
        isMobile: isMobile,
      })
    })
  })
})
