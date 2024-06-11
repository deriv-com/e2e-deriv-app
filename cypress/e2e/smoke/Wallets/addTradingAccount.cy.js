describe('QATEST-142456, QATEST-158991 - Add Trading account', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletloginEmail' })
  })

  it(
    'should add trading account to wallet account (Crypto)',
    { scrollBehavior: false },
    () => {
      cy.c_visitResponsive('/', 'large')
      cy.findByText(/Wallet/, { timeout: 10000 }).should('exist')
      cy.c_setupTradeAccount('USD')
      cy.c_setupTradeAccount('BTC')
      cy.c_setupTradeAccount('ETH')
      cy.c_setupTradeAccount('LTC')
    }
  )

  it(
    'QATEST-158991 - should add USD trading account to wallet account in responsive',
    { scrollBehavior: false },
    () => {
      cy.c_visitResponsive('/', 'small')
      cy.findAllByText(/Wallet/, { timeout: 10000 }).should('exist')
      cy.findAllByText(/Deposit/, { timeout: 10000 }).should('exist')
      cy.c_skipPasskeysV2()
      cy.findByText("Trader's Hub").should('be.visible')
      cy.c_setupUSDTradeAccountResponsive('USD')
    }
  )

  it(
    'should add trading account to wallet account (Crypto) in responsive',
    { scrollBehavior: false },
    () => {
      cy.c_visitResponsive('/', 'small')
      cy.c_skipPasskeysV2()
      cy.findAllByText(/Wallet/, { timeout: 10000 }).should('exist')
      cy.c_skipPasskeysV2()
      cy.findAllByText(/Deposit/, { timeout: 10000 }).should('exist')
      cy.c_skipPasskeysV2()
      cy.c_switchWalletsAccountResponsive('BTC')
      cy.c_setupTradeAccountResponsive('BTC')
      cy.c_switchWalletsAccountResponsive('ETH')
      cy.c_setupTradeAccountResponsive('ETH')
      cy.c_switchWalletsAccountResponsive('LTC')
      cy.c_setupTradeAccountResponsive('LTC')
    }
  )
})
