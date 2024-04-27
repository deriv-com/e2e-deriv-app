import '@testing-library/cypress/add-commands'

function performCryptoDeposit() {
  cy.contains('Wallet', { timeout: 10000 }).should('exist')
  if (Cypress.config('viewportWidth') < 1100) {
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
  cy.findByText('Copied!')
  cy.findByText('Try Fiat onramp').click()
  cy.findByText('Banxa')
}

function performCryptoDepositFiatonRamp() {
  cy.contains('Wallet', { timeout: 10000 }).should('exist')
  if (Cypress.config('viewportWidth') < 1100) {
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

describe('WALL-2831 - Crypto deposit and fiat onramp', () => {
  //Prerequisites: Crypto wallet account with access to banxa provider in any qa box with app id 11780
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
  })

  it('should be able to view crypto deposit details', () => {
    cy.c_visitResponsive('/wallets', 'large')
    cy.log('Crypto Deposit')
    performCryptoDeposit()
  })

  it('should be able to deposit into crypto account through fiat onramp', () => {
    cy.c_visitResponsive('/wallets', 'large')
    cy.log('Access Fiat OnRamp Provider')
    performCryptoDepositFiatonRamp()
  })
  it('should be able to view crypto deposit details in responsive', () => {
    cy.c_visitResponsive('/wallets', 'small')
    cy.log('Crypto Deposit')
    performCryptoDeposit()
  })

  it('should be able to deposit into crypto account through fiat onramp in responsive', () => {
    cy.c_visitResponsive('/wallets', 'small')
    cy.log('Access Fiat OnRamp Provider')
    performCryptoDeposit()
  })
})
