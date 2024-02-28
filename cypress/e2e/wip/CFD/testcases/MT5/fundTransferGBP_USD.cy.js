import '@testing-library/cypress/add-commands'
import mt5_tradershub from '../../Pages/mt5PageObjects'
import fundTransferPageObjects from '../../Pages/fundTransferPageObjects'

describe("QATEST-37216 - MT5 Deposit & withdrawal for different fiat currencies (GBP-USD)", () => {
    beforeEach(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'large')
    })
    
    it('MT5 account deposit, GBP to Derived SVG',() => {
        mt5_tradershub.selectRealAccount()
        fundTransferPageObjects.mt5Deposit('Pound Sterling','Derived SVG')
    })

    it('MT5 account withdrawal, Derived SVG to GBP',() => {
        mt5_tradershub.selectRealAccount()
        fundTransferPageObjects.mt5Withdrawal('Pound Sterling','Derived SVG')
    })

})
