import '@testing-library/cypress/add-commands'
describe('QATEST-154042 -  Client with USD more than 3 months, but registered for P2P', () => {
    it('Client with USD more than 3 months, but P2P registered', () =>{
    cy.c_login({ app: 'wallets', user: 'walletMigrationP2P' })
    cy.log('Logged into walletMigrationP2P')
    cy.c_checkForbanner()  
    cy.findByText('US Dollar').should('be.visible')
    cy.get('#dt_cashier_tab > .dc-text').should('be.visible').click()
    cy.findByRole('link', { name: 'Deriv P2P' }).should('be.visible').click()
    cy.findByText('My profile').should('be.visible').click()
    cy.findByRole('button', { name: 'Stats' }).should('be.visible')
    cy.findByRole('button', { name: 'Payment methods' }).should('be.visible')
    cy.findByRole('button', { name: 'Ad details' }).should('be.visible')
    cy.findByRole('button', { name: 'My counterparties' }).should('be.visible')
    })
})