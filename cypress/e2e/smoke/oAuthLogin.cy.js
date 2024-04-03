import '@testing-library/cypress/add-commands'

describe('Get oAuthUrl', () => {
  beforeEach(() => {
    cy.log('<E2EOAuthUrl - beforeEach>' + Cypress.env('oAuthUrl'))
    cy.c_login()
  })

  it('should get the oauth url from API', () => {
    cy.log('<E2EOAuthUrl - Test 1>' + Cypress.env('oAuthUrl'))
  })

  it('should get the oauth url from env variable', () => {
    cy.log('<E2EOAuthUrl - Test 2>' + Cypress.env('oAuthUrl'))
  })
})
