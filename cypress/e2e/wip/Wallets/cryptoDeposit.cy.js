import '@testing-library/cypress/add-commands'

describe('WALL-2831 - Crypto deposit and fiat onramp', () => {
  //Prerequisites: Crypto wallet account with access to banxa provider in any qa box with app id 11780
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to view crypto deposit details', () => {
    cy.log('Crypto Deposit')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.get('.wallets-dropdown__button').click()
    cy.get('.wallets-list-card-dropdown__item-content')
      .contains('BTC Wallet')
      .click()
    cy.get('.wallets-list-details__content').within(() => {
      cy.findByText(/BTC/).should('be.visible')
    })
    cy.findByText('Deposit').should('be.visible')
    cy.findByText('Deposit').click()
    cy.get('canvas').should('be.visible')
    cy.findByText('Transaction status')
    cy.findByText(/To avoid loss of funds/)
    cy.get('.wallets-clipboard').click()
    cy.findByText('Copied!')
    cy.findByText('Try Fiat onramp').click()
    cy.findByText('Banxa')
  })

  it('should be able to deposit into crypto account through fiat onramp', () => {
    cy.log('Access Fiat OnRamp Provider')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.get('.wallets-dropdown__button').click()
    cy.get('.wallets-list-card-dropdown__item-content')
      .contains('BTC Wallet')
      .click()
    cy.get('.wallets-list-details__content').within(() => {
      cy.findByText(/BTC/).should('be.visible')
    })
    cy.findByText('Deposit').should('be.visible')
    cy.findByText('Deposit').click()
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
  })
})
