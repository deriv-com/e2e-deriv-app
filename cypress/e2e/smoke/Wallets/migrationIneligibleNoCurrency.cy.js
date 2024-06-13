describe('QATEST-154138 -  Client without currency added', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletMigrationNoCurrency' })
  })
  it('Client without currency added should not see  Wallets - Enable now banner', () => {
    cy.c_visitResponsive('/', 'large')
    cy.c_checkForBanner()
    cy.findByText('No currency assigned').should('be.visible')
  })
  it('Responsive - Client without currency added should not see  Wallets - Enable now banner', () => {
    cy.c_visitResponsive('/', 'small')
    cy.c_checkForBanner()
    cy.findByText('No currency assigned').should('be.visible')
  })
})
