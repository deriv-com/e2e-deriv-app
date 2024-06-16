import '@testing-library/cypress/add-commands'
function switchWallets() {
  const performActionsOnElement = (currentIndex, totalElements) => {
    if (currentIndex >= totalElements) {
      return
    }
    cy.get('.wallets-progress-bar')
      .find(
        '.wallets-progress-bar-active.wallets-progress-bar-transition, .wallets-progress-bar-inactive.wallets-progress-bar-transition'
      )
      .eq(currentIndex)
      .click()
      .then(() => {
        cy.get('.wallets-card__carousel-content-details')
          .eq(currentIndex)
          .find('.wallets-card__details-bottom')
          .invoke('text')

        const actions = ['deposit', 'withdraw', 'transfer']
        let actionChain = Cypress.Promise.resolve()
        actions.forEach((action) => {
          actionChain = actionChain
            .then(() => {
              return cy
                .get('.wallets-mobile-actions__container')
                .scrollIntoView()
                .find('.wallets-mobile-actions')
                .find(`button[aria-label="${action}"]`)
                .click({ force: true })
            })
            .then(() => {
              return cy
                .get('.wallets-cashier-header')
                .find('.wallets-cashier-header__close-icon')
                .click()
            })
        })

        actionChain.then(() => {
          performActionsOnElement(currentIndex + 1, totalElements)
        })
      })
  }

  cy.get(
    '.wallets-progress-bar-active.wallets-progress-bar-transition, .wallets-progress-bar-inactive.wallets-progress-bar-transition'
  ).then(($elements) => {
    performActionsOnElement(0, $elements.length - 1) // here -1 is to skip demo account as temp solution
  })
}

describe('QATEST-139905 - Mobile wallet card redirection', () => {
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
  })
  it('should be able to switch and open correct deposit, withdraw and transfer in all the available wallets in Responsive', () => {
    cy.c_visitResponsive('/wallets', 'small')
    switchWallets()
  })
})
