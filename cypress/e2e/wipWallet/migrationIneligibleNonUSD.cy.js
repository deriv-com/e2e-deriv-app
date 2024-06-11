describe('QATEST-154136 -  Client with Non-USD curency', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletMigratioNonUSD' })
  })
  it('Client with Non-USD curency should not see  Wallets - Enable now banner', () => {
    cy.c_visitResponsive('/', 'large')
    cy.c_checkForBanner()
    cy.findByText('US Dollar').should('not.exist')
  })
  it('Responsive - Client with Non-USD curency should not see  Wallets - Enable now banner', () => {
    cy.c_visitResponsive('/', 'small')
    cy.c_checkForBanner()
    cy.findByText('US Dollar').should('not.exist')
  })
})
