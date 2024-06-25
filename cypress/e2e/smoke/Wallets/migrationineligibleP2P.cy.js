describe('QATEST-154042 -  Client with USD more than 3 months, but registered for P2P', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletMigrationP2P' })
  })
  it('P2P registered client should not see  Wallets - Enable now banner', () => {
    cy.c_visitResponsive('/', 'large')
    cy.c_checkForBanner()
    cy.findByText('US Dollar').should('be.visible')
    cy.get('#dt_cashier_tab > .dc-text').should('be.visible').click()
    cy.findByRole('link', { name: 'Deriv P2P' }).should('be.visible').click()
    cy.findByText('My profile').should('be.visible').click()
    cy.findByRole('button', { name: 'Stats' }).should('be.visible')
    cy.findByRole('button', { name: 'Payment methods' }).should('be.visible')
    cy.findByRole('button', { name: 'Ad details' }).should('be.visible')
    cy.findByRole('button', { name: 'My counterparties' }).should('be.visible')
  })
  it('Responsive - P2P registered client should not see  Wallets - Enable now banner', () => {
    cy.c_visitResponsive('/', 'small')
    cy.c_skipPasskeysV2()
    cy.c_checkForBanner()
    cy.findByText('US Dollar').should('be.visible')
    cy.get('#dt_mobile_drawer_toggle').should('be.visible').click()
    cy.get('.dc-text').contains('Cashier').click()
    cy.findByRole('link', { name: 'Deriv P2P' }).should('be.visible').click()
    cy.findByText('My profile').should('be.visible').click()
    cy.get('.my-profile-stats__navigation').contains('.dc-text', 'Stats')
    cy.get('.my-profile-stats__navigation').contains(
      '.dc-text',
      'Payment methods'
    )
    cy.get('.my-profile-stats__navigation').contains('.dc-text', 'Ad details')
    cy.get('.my-profile-stats__navigation').contains(
      '.dc-text',
      'My counterparties'
    )
  })
})
