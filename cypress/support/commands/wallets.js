Cypress.Commands.add('c_switchWalletsAccount', (account) => {
  cy.get('.wallets-dropdown__button').click()
  cy.get('.wallets-list-card-dropdown__item-content')
    .contains(`${account} Wallet`)
    .click()
})
