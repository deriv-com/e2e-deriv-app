import '@testing-library/cypress/add-commands'

describe('QATEST-154041 -  Client with USD for less than 3 months', () => {
    it('Client with USD for less than 3 months', () =>{
    cy.c_login({ app: 'wallets', user: 'walletMigrationnewClient' })
    cy.log('Logged into walletMigrationnewClient ')
    cy.c_checkForbanner()   
    cy.findByText('US Dollar').should('be.visible')
    })

})

describe('QATEST-154136 -  Client with Non-USD curency', () => {
    it('Client with Non-USD curency', () =>{
    cy.c_login({ app: 'wallets', user: 'walletMigrationonUSD' })
    cy.log('Logged into walletMigrationonUSD ')
    cy.c_checkForbanner()  
    cy.findByText('US Dollar').should('not.exist') 
    })

})
describe('QATEST-154138 -  Client without currency added', () => {
    it('Client without currency added', () =>{
        cy.c_login({ app: 'wallets', user: 'walletMigrationnoCurrency' })
        cy.log('Logged into walletMigrationnoCurrency') 
        cy.c_checkForbanner()
        cy.findByText('No currency assigned').should('be.visible')
    })
})