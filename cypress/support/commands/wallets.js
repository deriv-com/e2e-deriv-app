Cypress.Commands.add('c_switchWalletsAccount', (account) => {
  if (account == 'USD Demo') {
    cy.findByText('USD Demo Wallet')
      .should(() => {})
      .then((el) => {
        if (el.length) {
          cy.log('you are in demo wallet')
        } else {
          cy.get('.wallets-list-header__slider').click()
        }
      })
  } else {
    cy.findByText('USD Demo Wallet')
      .should(() => {})
      .then((el) => {
        if (el.length) {
          cy.log('you are in demo wallet')
          cy.get('.wallets-list-header__slider').click()
        } else {
          cy.log('you are in real wallet')
        }
      })
    cy.get('.wallets-dropdown__button', { timeout: 10000 }).should('be.visible')
    cy.get('.wallets-dropdown__button').click()
    cy.get('.wallets-list-card-dropdown__item-content')
      .contains(`${account} Wallet`)
      .click()
    cy.c_rateLimit({ waitTimeAfterError: 15000, maxRetries: 5 })
  }
})

Cypress.Commands.add('c_switchWalletsAccountResponsive', (account) => {
  let currentIndex = 0 // Initialize index counter

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
        cy.log('scroll')
        resolve(false)
      }
    })
  }

  const clickNext = () => {
    return cy
      .get('div.wallets-progress-bar')
      .find('div.wallets-progress-bar-inactive')
      .eq(currentIndex) // Click on element based on currentIndex
      .click()
      .then(() => {
        currentIndex++ // Increment currentIndex
      })
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

Cypress.Commands.add('c_switchWalletsAccountDemo', () => {
  /// this is a temp solution for https://deriv-group.slack.com/archives/C0548T15K1P/p1714546473367569
  cy.get('div.wallets-progress-bar')
    .find('div.wallets-progress-bar-inactive')
    .last()
    .click()
})
