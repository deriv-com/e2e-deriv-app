import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/helper/utility'

describe('QATEST-24427,5533,5827 - Cypress test for ROW account sign up', () => {
  let size = ['small', 'desktop']
  let countryIDV = Cypress.env('countries').KE
  let nationalIDNumIDV = Cypress.env('nationalIDNum').KE
  let taxIDNumIDV = Cypress.env('taxIDNum').KE
  let countryOnfido = Cypress.env('countries').CO
  let nationalIDNumOnfido = Cypress.env('nationalIDNum').CO
  let taxIDNumOnfido = Cypress.env('taxIDNum').CO
  let currency = Cypress.env('accountCurrency').USD

  size.forEach((size) => {
    it(`New account sign up ROW - Onfido supported country on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const signUpEmail = `sanity${generateEpoch()}onfido@deriv.com`
      cy.c_setEndpoint(signUpEmail, size)
      cy.c_demoAccountSignup(countryOnfido, signUpEmail, size)
      cy.c_switchToReal()
      cy.findByTestId('dt_trading-app-card_real_deriv-account')
        .findByRole('button', { name: 'Get' })
        .click()
      cy.c_generateRandomName().then((firstName) => {
        cy.c_personalDetails(
          firstName,
          'Onfido',
          countryOnfido,
          nationalIDNumOnfido,
          taxIDNumOnfido,
          currency,
          { isMobile: size == 'small' ? true : false }
        )
      })
      cy.c_addressDetails()
      cy.c_completeFatcaDeclarationAgreement()
      cy.c_addAccount()
      cy.c_checkTradersHubHomePage(true)
      cy.c_closeNotificationHeader()
      cy.c_manageAccountsetting(countryOnfido)
    })
    it(`New account sign up ROW - IDV supported country on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const signUpEmail = `sanity${generateEpoch()}idv@deriv.com`
      cy.c_setEndpoint(signUpEmail, size)
      cy.c_demoAccountSignup(countryIDV, signUpEmail, size)
      cy.c_switchToReal()
      cy.findByTestId('dt_trading-app-card_real_deriv-account')
        .findByRole('button', { name: 'Get' })
        .click()
      cy.c_generateRandomName().then((firstName) => {
        cy.c_personalDetails(
          firstName,
          'IDV',
          countryIDV,
          nationalIDNumIDV,
          taxIDNumIDV,
          currency,
          { isMobile: size == 'small' ? true : false }
        )
      })
      cy.c_addressDetails()
      cy.c_completeFatcaDeclarationAgreement()
      cy.c_addAccount()
      cy.c_checkTradersHubHomePage(true)
      cy.c_closeNotificationHeader()
      cy.c_manageAccountsetting(countryIDV)
    })
  })
})
