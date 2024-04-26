import '@testing-library/cypress/add-commands'

describe('Checking the Balance', () => {
  it('should show balance call', () => {
    cy.c_login()
    cy.log('<E2EOAuthUrl - Test >' + Cypress.env('oAuthUrl'))
    cy.c_authorizeCall()
    cy.c_getBalance()
  })
})
