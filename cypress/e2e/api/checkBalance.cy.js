import '@testing-library/cypress/add-commands'

describe('QATEST - 145407 - Checking the Balance', () => {
  it('should show balance call', () => {
    cy.c_login()
    cy.log('<E2EOAuthUrl - Test >' + Cypress.env('oAuthUrl'))
    cy.c_authorizeCall()
    cy.c_getBalance()
  })
})
