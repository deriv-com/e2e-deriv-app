import '@testing-library/cypress/add-commands'

function reset_balance_demo() {
  cy.get(".wallets-dropdown__button").click()
  cy.findByText("USD Demo Wallet").scrollIntoView()
  cy.get(".wallets-list-card-dropdown__item-content").contains("USD Demo Wallet").click()
  cy.get(".wallets-list-details__content").within(()=>{
    cy.contains("USD").should("be.visible")
  })
  cy.contains("Reset balance").should("be.visible")
  cy.contains("Reset balance").click()
  cy.get('[class="wallets-cashier-content"]')
    .findByRole('button', { name: 'Reset balance' })
    .click()
  cy.findByText('Success').should('exist')
  cy.findByRole('button', { name: 'Transfer funds' }).click()
  //To check if Transfer tab is active on clicking Transfer funds
  cy.get('[class*="wallets-cashier-header__tab"].wallets-cashier-header__tab')
    .contains('Transfer')
    .parent()
    .should('be.visible')
    .invoke('attr', 'class') //would return the string of that class
    .should('include', 'wallets-cashier-header__tab--active') //find if the class has "active" string
}

describe('WALL-2760 - Transfer and check transactions for Demo wallet', () => {
  //Prerequisites: Demo wallet account in any qa box with USD demo funds
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to transfer demo funds', () => {
    cy.log('Transfer Demo Funds for Demo Account')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    reset_balance_demo()
    cy.contains(/Transfer from/).click()
    cy.findByRole('button', {
      name: 'USD Wallet Balance: 10,000.00 USD Demo',
      exact: true,
    }).click()
    cy.contains(/Transfer to/).click()
    cy.contains(/Deriv X/).click()
    cy.get('input[class="wallets-atm-amount-input__input"]')
      .eq(1)
      .click()
      .type('1.000')
    cy.get('form')
      .findByRole('button', { name: 'Transfer', exact: true })
      .should('be.enabled')
      .click()
    cy.findByText('Your transfer is successful!', {
      exact: true,
    }).should('be.visible')
    cy.findByRole('button', { name: 'Make a new transfer' }).click()
    cy.contains(/Transfer from/)
  })

  it('should be able to view demo transactions', () => {
    cy.log('View Transactions for Demo Account')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    reset_balance_demo()
    cy.findByRole('button', { name: 'Transactions' }).click()
    cy.findByTestId('dt_wallets_textfield_icon_right').findByRole('button').click()
    cy.findByRole("option", { name: "Reset balance" }).click()
    cy.contains("+10,000.00 USD")
    cy.findByTestId('dt_wallets_textfield_icon_right').findByRole('button').click()
    cy.findByRole("option", { name: "Transfer" }).click()
    cy.contains("-10.00 USD")
  })
})
