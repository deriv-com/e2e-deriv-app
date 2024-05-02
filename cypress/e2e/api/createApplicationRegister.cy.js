import '@testing-library/cypress/add-commands'

describe('Register a New Application / App ID', () => {
  it('Creation of New App ID should be successful. ', () => {
    cy.c_login()
    cy.c_wsConnect()

    const newAppId = cy.c_registerNewApplicationID()
    console.log('The New Application Id is : ', newAppId)

    cy.c_wsDisconnect()
  })
})
