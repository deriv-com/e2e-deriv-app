import '@testing-library/cypress/add-commands'

let updatedAppId
describe('QATEST - 148419 - Register a New Application / App ID', () => {
  it('Creation of New App ID should be successful. ', () => {
    // Login is required as we need Auth Token for running RegisterApplication API.
    cy.c_login()
    const oldAppdId = parseInt(Cypress.env('configAppId'))
    cy.task('wsConnect')
    cy.c_authorizeCall()

    // This method will create and return New App Id.
    cy.c_registerNewApplicationID().then(() => {
      updatedAppId = Cypress.env('updatedAppId')
      cy.log('The New App Before ID is: ', updatedAppId)
      cy.task('wsDisconnect')
      cy.c_logout()

      Cypress.config('baseUrl', Cypress.env('appRegisterUrl'))
      Cypress.env('configAppId', updatedAppId)
      Cypress.env('oAuthUrl', '<empty>')

      const newAppId = parseInt(Cypress.env('configAppId'))
      expect(newAppId).not.equal(oldAppdId)
    })
  })
})
