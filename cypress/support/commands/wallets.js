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
    cy.get('.wallets-dropdown__button', { timeout: 10000 }).should('exist')
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
      .find('div.wallets-progress-bar-active')
      .next()
      .click()
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
  cy.findByText('Derived', { timeout: 3000 }).should('exist')
  cy.get('div.wallets-progress-bar')
    .find('div.wallets-progress-bar-inactive')
    .last()
    .click({ force: true })
})

Cypress.Commands.add('c_checkForBanner', () => {
  cy.findByTestId('dt_div_100_vh')
    .findByText("Trader's Hub")
    .should('be.visible')
  cy.findByText('Deriv Trader', { timeout: 20000 }).should('be.visible')
  cy.findByText('Enjoy seamless transactions').should('not.exist')
})

Cypress.Commands.add('c_setupTradeAccount', (wallet, requireNew = true) => {
  cy.c_switchWalletsAccount(wallet)
  cy.findByRole('button', { name: 'Get' })
    .should(() => {})
    .then((button) => {
      if (button.length) {
        cy.wrap(button).click()
        cy.wait(1000)
        cy.findByRole('button', { name: 'Transfer funds' }).should('be.visible')
        cy.findByRole('button', { name: 'Maybe later', timeout: 3000 })
          .should('be.visible')
          .and('be.enabled')
          .click()
        cy.findByTestId('dt_themed_scrollbars')
          .findByText("Trader's Hub")
          .should('be.visible')
      } else {
        if (requireNew) {
          cy.fail('Trading account already added')
        } else {
          cy.log('Trading account already added')
        }
      }
    })
})

Cypress.Commands.add('c_setupTradeAccountResponsive', (wallet) => {
  cy.findByRole('button', { name: 'Options' }).click()
  cy.findByRole('button', { name: 'Get' })
    .should(() => {})
    .then((button) => {
      if (button.length) {
        cy.wrap(button).click()
        cy.findByRole('button', { name: 'Transfer funds' }).should('be.visible')
        cy.wait(500)
        cy.findByRole('button', { name: 'Maybe later', timeout: 3000 })
          .should('be.visible')
          .and('be.enabled')
          .click()
        cy.findByText("Trader's Hub").should('be.visible')
      }
    })
})

Cypress.Commands.add('c_openDTrader', () => {
  cy.findByText('Deriv Trader').click()
  cy.url().should('include', 'dtrader?chart_type=')
  cy.get('.sc-toolbar-widget') // wait for the side menu to be visible
    .should('be.visible')
})

Cypress.Commands.add('c_buyAccumulatorContract', (trade, growthRate) => {
  cy.findByText('Accumulators').click()
  cy.findByText('All').click()
  cy.get('.contract-type-list .contract-type-list__wrapper').then((el) => {
    cy.wrap(el).findByText(trade).click()
  })
  cy.get('.contract-type-widget__display')
    .find('span')
    .should('have.text', trade)
  cy.c_verifyTickChange(2000)
  cy.get('.number-selector__selection').contains(growthRate).click()
  cy.get('.btn-purchase__text_wrapper').contains('Buy').click()
  cy.findByText('Recent positions').should('be.visible')
  cy.get('.dc-contract-card').should('be.visible')
  cy.findByText('Go to Reports').should('be.visible').click()
  cy.get('.dc-dropdown__container').first().should('have.text', trade)
  cy.get('[class="dc-data-table"] a').should('have.length.gte', 1)
  cy.get('[class="dc-data-table"] a')
    .find('.growth_rate')
    .should('have.text', growthRate)
})

Cypress.Commands.add('c_verifyTickChange', (duration) => {
  cy.wait(duration)
  cy.get('body').then(($body) => {
    if ($body.find('.cq-symbol-closed-text').length > 0) {
      cy.log('This market is closed currently')
    } else {
      let initialPrice
      cy.get('.cq-current-price')
        .invoke('text')
        .should('not.be.empty')
        .then((text) => {
          initialPrice = text
        })
      cy.wait(duration)
      cy.get('.cq-current-price')
        .invoke('text')
        .should('not.be.empty')
        .then((text) => {
          expect(text).to.not.eq(initialPrice)
        })
    }
  })
})

Cypress.Commands.add(
  'c_buyAccumulatorContractResponsive',
  (trade, growthRate) => {
    cy.findByText('Accumulators').click()
    cy.get('.contract-type-list .contract-type-list__wrapper').then((el) => {
      cy.wrap(el).findByText(trade).click()
    })
    cy.get('.contract-type-widget__display')
      .find('span')
      .should('have.text', trade)
    cy.c_verifyTickChange(2000)
    cy.get('.mobile-widget .mobile-widget__item').click() // click on growth percentage
    cy.get('.dc-radio-group__item').contains(growthRate).click()

    cy.get('.flutter-chart flt-glass-pane') // wait for the visibility of the chart
      .should('be.visible')
    cy.get('#dt_purchase_accu_button', { timeout: 3000 }).should('be.enabled')
    cy.get('.btn-purchase__text_wrapper').contains('Buy').click()
    cy.get('.swipeable-notification').should('be.visible')
    cy.get('#dt_positions_toggle').click() // open Recent positions
    cy.findByText('Recent positions').should('be.visible')
    cy.get('.dc-contract-card').should('be.visible')
    cy.findByText('Go to Reports').should('be.visible').click()
    cy.get('.dc-contract-card').should('be.visible')
    cy.get('.dc-contract-card__grid')
      .find('#dc-contract_card_type_label')
      .should('include.text', trade)
    cy.get('.dc-contract-card__grid')
      .find('#dc-contract_card_type_label')
      .should('include.text', growthRate)
  }
)
