import '@testing-library/cypress/add-commands'
import mt5_tradershub from '../../Pages/mt5PageObjects'
import fundTransferPageObjects from '../../Pages/fundTransferPageObjects'

describe("QATEST-37228 - MT5 Deposit & withdrawal for different fiat currencies (AUD-USD)", () => {
    beforeEach(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'large')
    })
    
    it('MT5 account deposit, AUD to Derived SVG',() => {
        mt5_tradershub.selectRealAccount()
        fundTransferPageObjects.mt5Deposit('Australian Dollar','Derived SVG')
    })

    it('MT5 account withdrawal, Derived SVG to AUD',() => {
        mt5_tradershub.selectRealAccount()
        fundTransferPageObjects.mt5Withdrawal('Australian Dollar','Derived SVG')
    })

})
