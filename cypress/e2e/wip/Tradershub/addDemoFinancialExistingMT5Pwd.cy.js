import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/helper/utility'

describe('QATEST-5724: CFDs - Create a demo Financial account using existing MT5 account password', () => {
  const signUpEmail = `sanity${generateEpoch()}mail@deriv.com`
  let country = Cypress.env('countries').CO

  beforeEach(() => {
    cy.c_setEndpoint(signUpEmail)
  })

  it('Verify I can add a demo financial account using exisiting MT5 derieved account password', () => {
    cy.c_demoAccountSignup(country, signUpEmail)
    cy.c_checkTradersHubHomePage()
    cy.findAllByRole('button', { name: 'Get' }).first().click()
    cy.findByText('Create a Deriv MT5 password').should('be.visible')
    cy.findByText(
      'You can use this password for all your Deriv MT5 accounts.'
    ).should('be.visible')

    cy.findByTestId('dt_mt5_password').type(Cypress.env('mt5Password'), {
      log: false,
    })
    cy.findByRole('button', { name: 'Create Deriv MT5 password' }).click()
    cy.findByRole('heading', { name: 'Success!' }).should('be.visible')
    cy.get('.dc-modal-body').should(
      'contain.text',
      'Success!Congratulations, you have successfully created your demo Deriv MT5 Derived account'
    )
    cy.findByRole('button', { name: 'Continue' }).click()
    cy.findByText('10,000.00 USD').should('be.visible')
    cy.findByRole('button', { name: 'Top up' }).should('exist')
    cy.findAllByRole('button', { name: 'Get' }).eq(0).click()
    cy.findByText('Enter your Deriv MT5 password').should('be.visible')
    cy.findByText(
      'Enter your Deriv MT5 password to add a MT5 Demo Financial account.'
    ).should('be.visible')
    cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
    cy.findByRole('button', { name: 'Forgot password?' }).should('be.visible')
    cy.findByTestId('dt_mt5_password').type(Cypress.env('mt5Password'), {
      log: false,
    })
    cy.findByRole('button', { name: 'Add account' }).click()
    cy.get('.dc-modal-body').should(
      'contain.text',
      'Success!Congratulations, you have successfully created your demo Deriv MT5 Financial account.'
    )
    cy.findByRole('button', { name: 'Continue' }).click()
    cy.findAllByText('10,000.00 USD').eq(1).should('be.visible')
    cy.findAllByRole('button', { name: 'Top up' }).eq(1).should('exist')
    cy.get('.trade-button').eq(1).click()
    cy.get('#modal_root').findByText('Financial Demo').should('be.visible')
  })
})
