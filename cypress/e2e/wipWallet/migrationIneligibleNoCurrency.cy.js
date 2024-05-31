import '@testing-library/cypress/add-commands'
describe('QATEST-154138 -  Client without currency added', () => {
  it('Client without currency added should not see  Wallets - Enable now banner', () => {
    cy.c_login({ app: 'wallets', user: 'walletMigrationNoCurrency' })
    cy.log('Logged into walletMigrationNoCurrency')
    cy.c_checkForBanner()
    cy.findByText('No currency assigned').should('be.visible')
  })
})
