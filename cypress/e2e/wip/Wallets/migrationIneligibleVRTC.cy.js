import '@testing-library/cypress/add-commands'

describe('QATEST-153921 -  Client  VRTC', () => {
    it('Client without VRTC', () =>{
        cy.c_login({ app: 'wallets', user: 'walletMigrationwithoutVRTC' })
        cy.log('Logged into walletMigrationwithoutVRTC')
        cy.c_checkForbanner()
        cy.findByText('US Dollar').should('be.visible')
        cy.findByTestId('dt_dropdown_display').click()
        cy.get('#demo').click()
        cy.findByText('demo', { exact: true }).should('be.visible')
        cy.findByTestId('dt_traders_hub').findByText('0.00').should('be.visible')
    })
})

describe('QATEST-154139 -  Client with only VRTC', () => {
    it('Client with only VRTC', () =>{
        cy.c_login({ app: 'wallets', user: 'walletMigrationVRTConly' })
        cy.log('Logged into walletMigrationVRTConly')
        cy.c_checkForbanner()
        cy.findByText('demo', { exact: true }).should('be.visible')
        cy.findByTestId('dt_dropdown_display').click()
        cy.get('#real').click()
        cy.findByRole('heading', { name: 'Add a Deriv account' }).should('be.visible')
        cy.findByRole('heading', { name: 'Select your preferred currency' }).should('be.visible')
        
    })

})