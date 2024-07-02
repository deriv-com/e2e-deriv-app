let balanceAmount = 10000

describe('QAA-1558 - To make a Buy API call', () => {
  it('Buy API Call', () => {
    cy.log('Creating a New Account')
    cy.c_visitResponsive('/')
    cy.c_createDemoAccount()
    cy.c_login()
    cy.task('wsConnect')

    cy.c_authorizeCall().then(() => {
      const expectedEmail = Cypress.env('newlyCreatedEmail')
      const actualEmail = Cypress.env('actualEmail')

      expect(expectedEmail).to.equal(actualEmail)
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
