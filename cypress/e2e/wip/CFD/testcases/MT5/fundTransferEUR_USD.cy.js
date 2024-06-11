import fundTransferPageObjects from '../../Pages/fundTransferPageObjects'
import mt5_tradershub from '../../Pages/mt5PageObjects'

describe('QATEST-37204 - MT5 Deposit & withdrawal for different fiat currencies (EUR-USD)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })

  it('MT5 account deposit, EUR to Derived SVG', () => {
    mt5_tradershub.selectRealAccount()
    fundTransferPageObjects.mt5Deposit('Euro', 'Derived SVG')
  })

  it('MT5 account withdrawal, Derived SVG to EUR', () => {
    mt5_tradershub.selectRealAccount()
    fundTransferPageObjects.mt5Withdrawal('Euro', 'Derived SVG')
  })
})
