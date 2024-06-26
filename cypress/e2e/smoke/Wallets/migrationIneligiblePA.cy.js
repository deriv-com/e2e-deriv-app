describe('QATEST-154043 - Client with USD more than 3 months & Payment agent', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletMigrationPA' })
  })
  it('Client with USD more than 3 months & PA should not see  Wallets - Enable now banner', () => {
    cy.c_visitResponsive('/', 'large')
    cy.c_checkForBanner()
    cy.findByText('US Dollar').should('be.visible')
    cy.get('#dt_cashier_tab > .dc-text').should('be.visible').click()
    cy.findByRole('link', { name: 'Transfer to client' })
      .should('be.visible')
      .click()
    cy.findByRole('heading', { name: 'Transfer to client' }).should(
      'be.visible'
    )
    cy.findByTestId('dt_payment_agent_transfer_form_input_loginid').should(
      'be.visible'
    )
    cy.findByRole('button', { name: 'Transfer' }).should('be.disabled')
  })
  it('Client with USD more than 3 months & PA should not see  Wallets - Enable now banner - Responsive', () => {
    cy.c_visitResponsive('/', 'small')
    cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
    cy.c_skipPasskeysV2()
    cy.c_checkForBanner()
    cy.findByText('US Dollar').should('be.visible')
    cy.get('#dt_mobile_drawer_toggle').should('be.visible').click()
    cy.get('.dc-text').contains('Cashier').click()
    cy.get('.dc-text').contains('Transfer to client').click()
    cy.findByText('Transfer to client').should('be.visible')
    cy.findByTestId('dt_payment_agent_transfer_form_input_loginid').should(
      'be.visible'
    )
    cy.findByRole('button', { name: 'Transfer' }).should('be.disabled')
  })
})
describe('QATEST-154263 - Client with USD more than 3 months & used PA in recently', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletMigrationPAclient' })
  })
  it('Should not see  Wallets - Enable now banner', () => {
    cy.c_visitResponsive('/', 'large')
    cy.c_checkForBanner()
  })
  it('Responsive - Should not see  Wallets - Enable now banner', () => {
    cy.c_visitResponsive('/', 'small')
    cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
    cy.c_skipPasskeysV2()
    cy.c_checkForBanner('Deriv Trader', 'Deriv GO')
  })
})
