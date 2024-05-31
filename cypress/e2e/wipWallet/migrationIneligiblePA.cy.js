import '@testing-library/cypress/add-commands'
describe('QATEST-154043 - Client with USD more than 3 months & Payment agent', () => {
  it('Client with USD more than 3 months & PA should not see  Wallets - Enable now banner', () => {
    cy.c_login({ app: 'wallets', user: 'walletMigrationPA' })
    cy.log('Logged into walletMigrationPA')
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
})
describe('QATEST-154263 - Client with USD more than 3 months & used PA in recently', () => {
  it('Should not see  Wallets - Enable now banner', () => {
    cy.c_login({ app: 'wallets', user: 'walletMigrationPAclient' })
    cy.log('Logged into walletMigrationPAclient')
    cy.c_checkForBanner()
  })
})
