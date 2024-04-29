import '@testing-library/cypress/add-commands'

function performCryptoDeposit(platform) {
  cy.contains('Wallet', { timeout: 10000 }).should('exist')
  if (`${platform}` == `mobile`) {
    cy.log('mobile view')
    cy.c_switchWalletsAccountResponsive('BTC')
  } else {
    cy.c_switchWalletsAccount('BTC')
  }
  cy.findByText('Deposit').parent().should('be.visible').click()
  cy.get('canvas').should('be.visible')
  cy.findByText('Transaction status')
  cy.findByText(/To avoid loss of funds/)
  cy.get('.wallets-clipboard').click()
  if (`${platform}` == `desktop`) {
    cy.findByText('Copied!')
  }
  cy.findByText('Try Fiat onramp').click()
  cy.findByText('Banxa')
}

function performCryptoDepositFiatonRamp(platform) {
  cy.contains('Wallet', { timeout: 10000 }).should('exist')
  if (`${platform}` == `mobile`) {
    cy.log('mobile view')
    cy.c_switchWalletsAccountResponsive('BTC')
  } else {
    cy.c_switchWalletsAccount('BTC')
  }
  cy.findByText('Deposit').should('be.visible').click()
  cy.findByText('Try Fiat onramp').click()
  cy.findByText('Banxa')
  cy.findByRole('button', { name: 'Select' }).click()
  cy.findByText('Disclaimer')
  cy.findByRole('button', { name: 'Back' }).click()
  cy.findByRole('button', { name: 'Select' }).click()
  cy.findByRole('button', { name: 'Continue' })
    .should('be.enabled')
    .invoke('removeAttr', 'target')
    .click()
}

describe('QATEST-98781 - Crypto deposit and fiat onramp', () => {
  //Prerequisites: Crypto wallet account with access to banxa provider in any qa box with app id 11780
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
  })

  it('should be able to view crypto deposit details', () => {
    cy.c_visitResponsive('/wallets', 'large')
    cy.log('Crypto Deposit')
    performCryptoDeposit('desktop')
  })

  it('should be able to deposit into crypto account through fiat onramp', () => {
    cy.c_visitResponsive('/wallets', 'large')
    cy.log('Access Fiat OnRamp Provider')
    performCryptoDepositFiatonRamp('desktop')
  })
  it('should be able to view crypto deposit details in responsive', () => {
    cy.c_visitResponsive('/wallets', 'small')
    cy.log('Crypto Deposit')
    performCryptoDeposit('mobile')
  })

  it('should be able to deposit into crypto account through fiat onramp in responsive', () => {
    cy.c_visitResponsive('/wallets', 'small')
    cy.log('Access Fiat OnRamp Provider')
    performCryptoDeposit('mobile')
  })
})
