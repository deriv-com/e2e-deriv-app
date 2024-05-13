import '@testing-library/cypress/add-commands'

let updatedAppId
describe('QATEST - 148419 - Register a New Application / App ID', () => {
  it('Creation of New App ID should be successful. ', () => {
    cy.c_wsConnect()
    cy.c_login() // Here Login is required as we need Auth ID for running RegisterApplication API. We are updating the 'configAppId' with 'newAppId'
    cy.c_authorizeCall()

    cy.c_registerNewApplicationID().then(() => {
      updatedAppId = Cypress.env('updatedAppId')
      cy.log('The New App Before ID is: ', updatedAppId)

      cy.c_logout()
      // cy.wsDisconnect()
      Cypress.env('baseUrl', Cypress.env('appRegisterHomePage'))
      Cypress.env('configAppId', updatedAppId)
      cy.c_wsConnect()
      cy.c_login()
    })

    cy.wsDisconnect()
  })
})
