import '@testing-library/cypress/add-commands'

describe('QATEST - 145407 - Checking the Balance', () => {
  it('should show balance call', () => {
    cy.c_login()
    cy.c_wsConnect()

    cy.log('<E2EOAuthUrl - Test >' + Cypress.env('oAuthUrl'))

    cy.c_authorizeCall()

    const balanceResponse = cy.c_getBalance().balance
    cy.log('The Available Balance Amount is: ' + balanceResponse)
    expect(Cypress.env('balanceAmount')).to.be.at.most(balanceResponse)

    cy.c_wsDisconnect()
  })
})
