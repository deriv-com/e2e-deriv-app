import '@testing-library/cypress/add-commands'

function reset_balance_demo() {
  cy.get('.wallets-dropdown__button').click()
  cy.findByText('USD Demo Wallet').scrollIntoView()
  cy.get('.wallets-list-card-dropdown__item-content')
    .contains('USD Demo Wallet')
    .click()
  cy.get('.wallets-list-details__content').within(() => {
    cy.contains('USD').should('be.visible')
  })
  cy.findByText('Reset balance').should('be.visible')
  cy.findByText('Reset balance').click()
  cy.get('[class="wallets-cashier-content"]')
    .findByRole('button', { name: 'Reset balance' })
    .click()
  cy.findByText('Success').should('exist')
  cy.findByRole('button', { name: 'Transfer funds' }).click()
  //To check if Transfer tab is active on clicking Transfer funds
  cy.get('[class*="wallets-cashier-header__tab"].wallets-cashier-header__tab')
    .findByText('Transfer')
    .parent()
    .should('be.visible')
    .invoke('attr', 'class') //would return the string of that class
    .should('include', 'wallets-cashier-header__tab--active') //find if the class has "active" string
}

describe('WALL-2760 - Reset Balance for Demo wallet', () => {
  //Prerequisites: Demo wallet account in any qa box with USD demo funds
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to reset balance for demo wallet', () => {
    cy.log('Reset Balance for Demo Account')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    reset_balance_demo()
  })
})
