import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/tradersHub'

describe('QATEST-24444 - Verify the user is able to close the personal details pop up during sign up', () => {
  const signUpMail = `sanity${generateEpoch()}account@deriv.com`
  let country = Cypress.env('countries').CO

  beforeEach(() => {
    cy.c_setEndpoint(signUpMail)
  })

  it('Should validate the pop up functionality when user closes the personal details section', () => {
    cy.c_demoAccountSignup(country, signUpMail)
    cy.c_switchToReal()
    cy.findByRole('button', { name: 'Get a Deriv account' }).click({
      force: true,
    })
    cy.findByText('US Dollar').click()
    cy.findByRole('button', { name: 'Next' }).click()
    cy.findByTestId('dt_modal_close_icon').click()
    cy.findByText('Stop creating an account?').should('be.visible')
    cy.findByText('If you hit Yes, the info you entered will be lost.').should(
      'be.visible'
    )
    cy.findByRole('button', { name: 'No' }).click()
    cy.findByText('Complete your personal details').should('be.visible')
    cy.findByTestId('dt_modal_close_icon').click()
    cy.findByRole('button', { name: 'Yes' }).click()
    cy.c_checkTradersHubHomePage()
  })
})
