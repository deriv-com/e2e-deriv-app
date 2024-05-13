import '@testing-library/cypress/add-commands'

let updatedAppId
describe('QATEST - 148419 - Register a New Application / App ID', () => {
  it('Creation of New App ID should be successful. ', () => {
    cy.c_wsConnect()
    // Login is required as we need Auth Token for running RegisterApplication API.
    cy.c_login() 
    cy.c_authorizeCall()

    // This method will create and return New App Id.
    cy.c_registerNewApplicationID().then(() => {
      updatedAppId = Cypress.env('updatedAppId')
      cy.log('The New App Before ID is: ', updatedAppId)

      cy.c_logout()
      cy.c_wsDisconnect()
      Cypress.env('baseUrl', Cypress.env('appRegisterUrl'))
      Cypress.env('configAppId', updatedAppId)
      cy.c_wsConnect()
      cy.c_login()
    })

    cy.c_wsDisconnect()
  })
})
