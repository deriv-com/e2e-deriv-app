import '@testing-library/cypress/add-commands'

describe('Validate login functionality', () => {
  beforeEach(() => {
    cy.c_visitResponsive(Cypress.env('RegionEU'), 'small')
  })

  it('Validate user can login at EU/non-EU Website', () => {

    cy.findByLabelText('Login').click()
    cy.findByPlaceholderText('example@email.com').type(Cypress.env('loginEmail'), { log: false })
    cy.findByLabelText('Password').click()
    cy.findByLabelText('Password').type(Cypress.env('loginPassword'), { log: false })
    cy.findByRole('button', { name: 'Log in' }).click()
    //await page.goto('https://app.deriv.com/');
    //cy.findByText('Volatility 100 (1s) Index').should('be.visible')
  })
})
