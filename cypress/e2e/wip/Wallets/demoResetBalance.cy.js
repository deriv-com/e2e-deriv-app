import '@testing-library/cypress/add-commands'

function reset_balance_demo(platform) {
  if (`${platform}` == `mobile`) {
    cy.log('mobile view')
    cy.c_switchWalletsAccountResponsive('USD Demo')
  } else {
    cy.c_switchWalletsAccount('USD Demo')
  }
  cy.findByText('Reset balance').should('be.visible').click()
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

describe('QATEST-98815 - Demo reset balance', () => {
  //Prerequisites: Demo wallet account in any qa box with USD demo funds
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
  })

  it('should be able to reset balance for demo wallet', () => {
    cy.log('Reset Balance for Demo Account')
    cy.c_visitResponsive('/wallets', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    reset_balance_demo('desktop')
  })
})
