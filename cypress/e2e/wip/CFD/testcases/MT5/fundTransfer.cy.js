import '@testing-library/cypress/add-commands'
import mt5_tradershub from '../../Pages/mt5PageObjects'
import fundTransferPageObjects from '../../Pages/fundTransferPageObjects'

describe("CFDS-2826 - Fund transfer of MT5 USD to USD", () => {
    beforeEach(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'large')
    })
    
    it('MT5 account deposit, USD to Derived SVG',() => {
        mt5_tradershub.selectRealAccount()
        fundTransferPageObjects.mt5Deposit()
    })

    it('MT5 account withdrawal, Derived SVG to USD',() => {
        mt5_tradershub.selectRealAccount()
        fundTransferPageObjects.mt5Withdrawal()
    })

})
