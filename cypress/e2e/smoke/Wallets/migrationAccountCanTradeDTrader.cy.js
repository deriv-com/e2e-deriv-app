describe('QATEST-160366 -  TH: Demo - Migrated account can trade - DTrader', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletDemoAccount' })
  })

  it('real - migrated account should be to trade - DTrader', () => {
    cy.c_visitResponsive('/', 'large')
    cy.findByText('Standard').should('be.visible')
    cy.c_openDTrader()
    cy.c_buyAccumulatorContract('Accumulators', '5%')
  })

  it(
    'real - migrated account should be to trade - DTrader in responsive',
    { scrollBehavior: false },
    () => {
      s
      cy.c_visitResponsive('/', 'small')
      cy.findByText('Standard').should('be.visible')
      cy.c_skipPasskeysV2()
      cy.findByRole('button', { name: 'Options' }).click()
      cy.c_openDTrader()
      cy.c_buyAccumulatorContractResponsive('Accumulators', '5%')
    }
  )
})
