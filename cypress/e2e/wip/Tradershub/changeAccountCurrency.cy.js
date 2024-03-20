import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/tradersHub'

describe('QATEST-5918: Verify Change currency functionality for the account which has no balance', () => {
  const signUpEmail = `sanity${generateEpoch()}crypto@deriv.com`
  let country = Cypress.env('countries').CO
  let nationalIDNum = Cypress.env('nationalIDNum').CO
  let taxIDNum = Cypress.env('taxIDNum').CO
  let oldCurrency = Cypress.env('accountCurrency').USD
  let newCurrency = Cypress.env('accountCurrency').EUR

  beforeEach(() => {
    localStorage.setItem('config.server_url', Cypress.env('stdConfigServer'))
    localStorage.setItem('config.app_id', Cypress.env('stdConfigAppId'))
    cy.c_visitResponsive('/endpoint', 'desktop')
    cy.findByRole('button', { name: 'Sign up' }).should('not.be.disabled')
    cy.c_enterValidEmail(signUpEmail)
  })
  it('Should be able to change currency', () => {
    cy.c_demoAccountSignup(country, signUpEmail)
    cy.c_switchToReal()
    cy.c_completeTradersHubTour()
    cy.findByRole('button', { name: 'Get a Deriv account' }).click()
    cy.c_generateRandomName().then((firstName) => {
      cy.c_personalDetails(
        firstName,
        'Onfido',
        country,
        nationalIDNum,
        taxIDNum,
        oldCurrency
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
    cy.findByText('Change your currency').should('be.visible')
    cy.findByText('Choose the currency you would like to trade with.').should(
      'be.visible'
    )
    cy.findByText(newCurrency).click()
    cy.findByRole('button', { name: 'Change currency' }).click()
    cy.findByRole('heading', { name: 'Success!' }).should('be.visible', {
      timeout: 30000,
    })
    cy.findByText('You have successfully changed your currency to EUR.').should(
      'be.visible'
    )
    cy.findByRole('button', { name: 'Deposit now' }).should('be.visible')
    cy.findByRole('button', { name: 'Maybe later' }).click()
  })
})
