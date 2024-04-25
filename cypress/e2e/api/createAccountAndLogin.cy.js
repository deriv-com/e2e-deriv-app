import '@testing-library/cypress/add-commands'

//title
describe('Test API account creation and Login', () => {
  beforeEach(() => {
    cy.log('<E2EOAuthUrl - beforeEach>' + Cypress.env('oAuthUrl'))
    cy.c_visitResponsive('/')
    cy.c_createRealAccount()
    cy.c_login()
  })

  it('should set the oauth url after successful account creation and login', () => {
    cy.log('<E2EOAuthUrl - Test >' + Cypress.env('oAuthUrl'))
    cy.log(
      'Login: ' +
        Cypress.env('credentials').test.masterUser.ID +
        ' was created successfully'
    )
  })
})
