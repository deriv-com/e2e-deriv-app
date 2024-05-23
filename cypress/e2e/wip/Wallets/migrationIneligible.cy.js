import '@testing-library/cypress/add-commands'

function c_checkForbanner(){
    cy.c_visitResponsive('/appstore/traders-hub' , 'large')
    /cy.findByText('Enjoy seamless transactions').should('not.exist')
    cy.findByTestId('dt_div_100_vh').findByText('Trader\'s Hub').should('be.visible')
    cy.findByText('Options').should('be.visible')
    cy.findByText('CFDs').should('be.visible')
    cy.findByText('US Dollar').should('be.visible')
    }


// }
describe('QATEST-154041 -  Client with USD for less than 3 months', () => {
    it('User should not see "upgrade now" button', () =>{
   // cy.c_setClienttype(recentUSDClientIneligible)
    cy.c_login({ app: 'wallets', user: 'recentUSDClientIneligible' })
    cy.log('Logged into recentUSDClientIneligible ')
    c_checkForbanner()   
    })

})
describe('QATEST-154139 -  Client without VRTC', () => {
    it.only('Client without VRTC', () =>{
        cy.c_login({ app: 'wallets', user: 'clientWithoutVRTC' })
        cy.log('Logged into clientWithoutVRTC')
        c_checkForbanner()
        cy.findByTestId('dt_dropdown_display').click()
        cy.get('#demo').click()
        cy.findByText('demo', { exact: true }).should('be.visible')
        cy.findByTestId('dt_traders_hub').findByText('0.00').should('be.visible')
    })

})
describe('QATEST-153921 -  Client without VRTC', () => {
    it.only('Client without VRTC', () =>{
        cy.c_login({ app: 'wallets', user: 'clientWithoutVRTC' })
        cy.log('Logged into clientWithoutVRTC')
        c_checkForbanner()
        cy.findByTestId('dt_dropdown_display').click()
        cy.get('#demo').click()
        cy.findByText('demo', { exact: true }).should('be.visible')
        cy.findByTestId('dt_traders_hub').findByText('0.00').should('be.visible')
    })


})

describe('QATEST-154139 -  Client without VRTC', () => {
    it.only('Client without VRTC', () =>{
        cy.c_login({ app: 'wallets', user: 'VRTConlyClient' })
        cy.log('Logged into VRTConlyClient')
        c_checkForbanner()
        cy.findByTestId('dt_dropdown_display').click()
        cy.get('#demo').click()
        cy.findByText('demo', { exact: true }).should('be.visible')
        cy.findByTestId('dt_traders_hub').findByText('0.00').should('be.visible')
    })


})