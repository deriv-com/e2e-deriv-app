import fundTransferPageObjects from '../../Pages/fundTransferPageObjects'
import mt5_tradershub from '../../Pages/mt5PageObjects'

describe('QATEST-37180 - MT5 Deposit & withdrawal for same fiat currency (USD-USD)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })

  it('MT5 account deposit, USD to Derived SVG', () => {
    mt5_tradershub.selectRealAccount()
    fundTransferPageObjects.mt5Deposit('US Dollar', 'Derived SVG')
  })

  it('MT5 account withdrawal, Derived SVG to USD', () => {
    mt5_tradershub.selectRealAccount()
    fundTransferPageObjects.mt5Withdrawal('US Dollar', 'Derived SVG')
  })
})
