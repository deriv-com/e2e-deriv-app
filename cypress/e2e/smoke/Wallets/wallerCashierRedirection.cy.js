import '@testing-library/cypress/add-commands'

describe('QATEST-139905 - user should be redirected to correct wallet cashier by clicking in wallet in responsive view', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletloginEmail' })
  })
  function checkWalletName(walletName) {
    cy.c_switchWalletsAccountResponsive(`${walletName}`)
    cy.get('.wallets-card__details-bottom').contains(`${walletName}`).click()
    cy.get('.wallets-cashier-header__details', { timeout: 3000 })
      .invoke('text')
      .should('include', `${walletName}`)
    cy.findByRole('main')
      .findByRole('button', { name: 'Deposit' })
      .should('be.visible')
      .invoke('attr', 'class') //would return the string of that class
      .should('include', 'wallets-cashier-header__tab--active')
    cy.findByRole('button', { name: 'Transfer' }).click()
    cy.get('.wallets-transfer-form-account-card__content')
      .contains(`${walletName}`)
      .should('exist')
    cy.get('.wallets-cashier-header__close-icon').click()
  }

  it('should be redirected to correct wallet cashier from wallet card', () => {
    cy.log('check BTC wallet')
    cy.c_visitResponsive('/', 'small')
    cy.c
    cy.contains('Deposit', { timeout: 10000 }).should('exist')
    cy.c_skipPasskeysV2()
    checkWalletName('BTC')
    checkWalletName('ETH')
  })
})
