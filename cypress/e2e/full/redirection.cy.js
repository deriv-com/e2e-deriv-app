import '@testing-library/cypress/add-commands'
describe('WALL-3591 - Verify changing platforms and markets in Dtrader', () => {
  beforeEach(() => {
    cy.c_login()
  })

  it('should remain logged in after redirection to another platform', () => {
    cy.findByTestId('dt_platform_switcher').click()
    cy.findByText('Automated trading at your fingertips. No coding needed.').click()
    cy.findByRole('button', { name: 'Skip' }).click()
    cy.findByText('Charts').click()
    cy.get('.cq-symbol-select-btn').click()
    cy.get('#dbot').findByText('Volatility 10 (1s) Index').click()
    cy.findByTestId('dt_platform_switcher').click()
    cy.findByText('A whole new trading experience on a powerful yet easy to use platform.').click()
    // Verify the chart loaded 
    cy.get('.chart-container__loader').should('not.exist', { timeout: 10000 })
    // Verify account remained logged in
    cy.findByRole('button', { name: 'Deposit' }).should('exist')
  })

})