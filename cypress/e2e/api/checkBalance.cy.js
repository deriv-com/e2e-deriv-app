import '@testing-library/cypress/add-commands'

let balanceAmount = 10000

describe('QATEST - 145407 - Checking the Balance', () => {
  it('should show balance call', () => {
    cy.c_login()

    cy.c_authorizeCall()

    cy.c_getBalance().then(() => {
      const actualAmountNum = parseInt(Cypress.env('actualAmount'))
      const expectedAmountNum = parseInt(balanceAmount)

      expect(actualAmountNum).to.be.at.most(expectedAmountNum)
    })

    cy.wsDisconnect()
  })
})
