let balanceAmount = 10000

describe('QAA-1558 - To make a Buy API call', () => {
  it('Buy API Call', () => {
    cy.c_login()
    cy.task('wsConnect')

    cy.c_authorizeCall().then(() => {
      const actualLoginEmail = Cypress.env('actualEmail')
      const loginEmailID = Cypress.env('loginEmail')

      expect(actualLoginEmail).to.equal(loginEmailID)
    })
    cy.c_getPriceProposal().then(() => {
      cy.c_buyContract().then(() => {
        const actualAmountNum = parseInt(Cypress.env('balanceAfterBuy'))
        const expectedAmountNum = parseInt(balanceAmount)

        expect(actualAmountNum).to.be.lessThan(expectedAmountNum)
      })
    })
  })
})
