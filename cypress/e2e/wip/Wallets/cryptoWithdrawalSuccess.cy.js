import '@testing-library/cypress/add-commands'

describe('QATEST-98698 - Crypto withdrawal success', () => {
  beforeEach(() => {
    cy.c_login({ user: 'wallets', backEndProd: true })
  })

  it('should be able to perform a successful crypto withdrawal', () => {
    cy.log('Crypto Withdrawal Success')

    cy.c_visitResponsive('/wallets', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')

    cy.findByText('Withdraw').click()
    cy.get('button').should('be.visible').should('have.text', 'Send email')
  })
})
