import { generateEpoch } from '../../../support/helper/utility'

describe('QATEST-146444: Verify Sign-up Flow in ES Language', () => {
  let country = 'España'
  let language = 'spanish'
  let size = 'small'
  let nationalIDNum = Cypress.env('nationalIDNum').ES
  let taxIDNum = Cypress.env('taxIDNum').ES
  let currency = Cypress.env('accountCurrency').USD

  it('Verify I can sign-up using ES language', () => {
    const signUpEmail = `sanity${generateEpoch()}es@deriv.com`
    cy.c_setEndpoint(signUpEmail, size, Cypress.config('baseUrl'), {
      language: language,
    })
    cy.c_demoAccountSignup(country, signUpEmail, size, { language: language })
    cy.c_generateRandomName().then((firstName) => {
      cy.c_personalDetails(
        firstName,
        'MF',
        country,
        nationalIDNum,
        taxIDNum,
        currency,
        { isMobile: true, language: language }
      )
    })
    cy.c_addressDetails({ language: language })
    cy.c_completeTradingAssessment({ isMobile: true, language: language })
    cy.c_completeFinancialAssessment({ isMobile: true, language: language })
    cy.c_completeFatcaDeclarationAgreement()
    cy.c_addAccountMF('MF', { isMobile: true, language: language })
    cy.findByTestId('dt_balance_text_container', { timeout: 40000 }).should(
      'have.text',
      '0.00USD'
    )
    cy.c_manageAccountsetting(country, { isMobile: true, language: language })
  })
})
