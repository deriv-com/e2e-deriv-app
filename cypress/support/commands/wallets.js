Cypress.Commands.add('c_switchWalletsAccount', (account) => {
  cy.get('.wallets-dropdown__button').click()
  cy.get('.wallets-list-card-dropdown__item-content')
    .contains(`${account} Wallet`)
    .click()
  cy.c_rateLimit({ waitTimeAfterError: 15000, maxRetries: 5 })
})
Cypress.Commands.add('c_switchWalletsAccountResponsive', (account) => {
  const checkForWallet = () => {
    return new Cypress.Promise((resolve) => {
      const elementsWithText = Cypress.$(`:contains("${account}")`)
      const visibleElementsWithText = elementsWithText.filter(
        (index, element) => Cypress.$(element).is(':visible')
      )
      if (visibleElementsWithText.length > 0) {
        cy.log('no scroll')
        resolve(true)
      } else {
        cy.log(' scroll')
        resolve(false)
      }
    })
  }
  const clickNext = () => {
    cy.get('.wallets-progress-bar-inactive').first().click()
  }
  const keepClickingNext = () => {
    clickNext().then(() => {
      checkForWallet().then((isTextVisible) => {
        if (!isTextVisible) {
          keepClickingNext()
        }
      })
    })
  }
  keepClickingNext()
  cy.c_rateLimit({ waitTimeAfterError: 15000, maxRetries: 5 })
})
