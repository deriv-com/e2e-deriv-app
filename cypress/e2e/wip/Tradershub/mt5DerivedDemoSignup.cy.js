import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/helper/utility'

describe('QATEST-5695: Create a Derived Demo CFD account', () => {
  let country = Cypress.env('countries').CO
  let size = ['small', 'desktop']

  size.forEach((size) => {
    it(`Verify I can signup for a demo derived CFD account on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const signUpEmail = `sanity${generateEpoch()}mt5deriveddemo@deriv.com`
      cy.c_setEndpoint(signUpEmail, size)
      cy.c_demoAccountSignup(country, signUpEmail, size)
      cy.c_checkTradersHubHomePage(size == 'small' ? true : false)
      if (size == 'small') cy.findByRole('button', { name: 'CFDs' }).click()
      cy.findAllByRole('button', { name: 'Get' }).first().click()
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
        'Success!Congratulations, you have successfully created your demo Deriv MT5 Derived account'
      )
      cy.findByRole('button', { name: 'Continue' }).click()
      cy.findByText('10,000.00 USD').should('be.visible')
      cy.findByRole('button', { name: 'Top up' }).should('exist')
      cy.findByTestId('dt_trading-app-card_demo_derived_svg')
        .findByRole('button', { name: 'Open' })
        .click({ force: true })
      cy.get('div.cfd-trade-modal-container')
        .findByText('Derived Demo')
        .should('be.visible')
    })
  })
})
