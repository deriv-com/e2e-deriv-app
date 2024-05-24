import '@testing-library/cypress/add-commands'
describe('QATEST-154138 -  Client without currency added', () => {
  it('Client without currency added', () => {
    cy.c_login({ app: 'wallets', user: 'walletMigrationnoCurrency' })
    cy.log('Logged into walletMigrationnoCurrency')
    cy.c_checkForbanner()
    cy.findByText('No currency assigned').should('be.visible')
  })
})
