Cypress.Commands.add('c_switchWalletsAccount', (account, action) => {
  cy.get('.wallets-dropdown__button').click()
  cy.get('.wallets-list-card-dropdown__item-content')
    .contains(`${account} Wallet`)
    .click()
  cy.findByText(action).should('be.visible').click()
})
