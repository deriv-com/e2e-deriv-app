import '@testing-library/cypress/add-commands'
describe('QATEST-154136 -  Client with Non-USD curency', () => {
  it('Client with Non-USD curency should not see  Wallets - Enable now banner', () => {
    cy.c_login({ app: 'wallets', user: 'walletMigratioNonUSD' })
    cy.log('Logged into walletMigratioNonUSD ')
    cy.c_checkForBanner()
    cy.findByText('US Dollar').should('not.exist')
  })
})
