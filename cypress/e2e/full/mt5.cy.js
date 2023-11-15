import '@testing-library/cypress/add-commands'

describe('QATEST-20309, QATEST-20310 - Login to an existing account.', () => {
  beforeEach(() => {
    cy.c_mt5login()
  })

  it('Should show the mt5 home page after login.', () => {
    cy.findByTitle('Menu').click()
    cy.findByText('Trading accounts').should('be.visible')
  })

  it('Should be able to trade.', () => {
    cy.findByText('Volatility 10 (1s) Index', { exact: true }).should('be.visible')
    cy.wait(2000)
    cy.findByText('Volatility 10 (1s) Index', { exact: true }).dblclick()
    //cy.wait(2000)
    cy.findByRole('button', { name: 'Sell by Market' }).should('be.visible')
    cy.findByRole('button', { name: 'Sell by Market' }).click()
    cy.wait(2000)
    cy.findByTitle('sell', { exact: true }).click({button: 'right'})
    cy.wait(2000)
  })

})