import '@testing-library/cypress/add-commands'
describe('QATEST-154043 - Client with USD more than 3 months but is a payment agent', () => {
    it('Client with USD more than 3 months & Payment agent', () =>{
    cy.c_login({ app: 'wallets', user: 'walletMigrationPA' })
    cy.log('Logged into walletMigrationPA')
    cy.c_checkForbanner()  
    cy.findByText('US Dollar').should('be.visible')
    cy.get('#dt_cashier_tab > .dc-text').should('be.visible').click()
    cy.findByRole('link', { name: 'Transfer to client' }).should('be.visible').click()
    cy.findByRole('heading', { name: 'Transfer to client' }).should('be.visible')
    cy.findByTestId('dt_payment_agent_transfer_form_input_loginid').should('be.visible')
    cy.findByRole('button', { name: 'Transfer' }).should('be.disabled')

    })
})
describe('QATEST-154263 - Client with USD more than 3 months & used PA in recently', () => {//PA client transfer
    it('Client used PA service in recent 3 months, joined more than 3 months', () =>{
    cy.c_login({ app: 'wallets', user: 'walletMigrationPAclient' })
    cy.log('Logged into walletMigrationPAclient')
    cy.c_checkForbanner() 
    })
})
