import '@testing-library/cypress/add-commands'

describe('Get oAuthUrl', () => {
  beforeEach(() => {
    cy.c_visitResponsive('/')
    cy.log('<E2EOAuthUrl - beforeEach>' + Cypress.env('oAuthUrl'))
    cy.c_createRealAccount()
    cy.c_login()
  })

  it('should get the oauth url from API', () => {
    cy.log('<E2EOAuthUrl - Test 1>' + Cypress.env('oAuthUrl'))
  })
})
