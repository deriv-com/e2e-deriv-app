import '@testing-library/cypress/add-commands'
describe('QATEST-154136 -  Client with Non-USD curency', () => {
    it('Client with Non-USD curency', () =>{
    cy.c_login({ app: 'wallets', user: 'walletMigrationonUSD' })
    cy.log('Logged into walletMigrationonUSD ')
    cy.c_checkForbanner()  
    cy.findByText('US Dollar').should('not.exist') 
    })

})