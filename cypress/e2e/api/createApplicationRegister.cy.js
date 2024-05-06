import '@testing-library/cypress/add-commands'

describe('Register a New Application / App ID', () => {
  it('Creation of New App ID should be successful. ', () => {
    if (Cypress.env('E2E_NEW_OAUTH_APPID').to.be.null()) {
      cy.c_wsConnect()
      cy.c_login() // Here Login is required as we need Auth ID for running RegisterApplication API. We are updating the 'configAppId' with 'newAppId'

      const newAppId = cy.c_registerNewApplicationID()
      console.log('The New Application Id is : ', newAppId)
      Cypress.env('configAppId', newAppId)
    }
    cy.c_login()

    cy.c_wsDisconnect()
  })
})
