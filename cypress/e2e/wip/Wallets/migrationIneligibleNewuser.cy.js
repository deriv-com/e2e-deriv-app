import '@testing-library/cypress/add-commands'

describe('QATEST-154041 -  Client with USD for less than 3 months', () => {
  it('New user should not see  Wallets - Enable now banner', () => {
    cy.c_login({ app: 'wallets', user: 'walletMigrationNewClient' })
    cy.log('Logged into walletMigrationNewClient ')
    cy.c_checkForBanner()
    cy.findByText('US Dollar').should('be.visible')
  })
})
