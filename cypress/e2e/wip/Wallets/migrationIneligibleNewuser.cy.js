import '@testing-library/cypress/add-commands'

describe('QATEST-154041 -  Client with USD for less than 3 months', () => {
    it('Client with USD for less than 3 months', () =>{
    cy.c_login({ app: 'wallets', user: 'walletMigrationnewClient' })
    cy.log('Logged into walletMigrationnewClient ')
    cy.c_checkForbanner()   
    cy.findByText('US Dollar').should('be.visible')
    })

})
