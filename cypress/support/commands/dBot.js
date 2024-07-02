Cypress.Commands.add('c_switchToDemoBot', () => {
  cy.findByTestId('dt_acc_info').click()
  cy.findByText('Demo').click()
  cy.findAllByText('Demo').eq(1).click()
  cy.findByTestId('dt_acc_info').should('be.visible', { timeout: 000 })
})

Cypress.Commands.add('c_runBot', () => {
  cy.get('.bot-dashboard.bot').should('be.visible')
  cy.findByRole('button', { name: 'Run' }).click()
})

Cypress.Commands.add('c_stopBot', (waitduration = undefined) => {
  if (waitduration) {
    cy.wait(waitduration)
  }
  cy.findByRole('button', { name: 'Stop' }).click()
})

Cypress.Commands.add('c_setBlockDuration', () => {
  cy.xpath(
    "(//*[@class='blocklyText' and text()='Duration:']/..)/*[@class='blocklyEditableText']"
  ).click()
  cy.findByRole('menuitemcheckbox', { name: 'Ticks' }).click()
  cy.findByRole('textbox').eq(1).type('2')
})

Cypress.Commands.add('c_skipTour', () => {
  cy.findByText('Skip').should('be.visible').click({ force: true })
})

Cypress.Commands.add('c_checkRunPanel', (clearPanel = false) => {
  cy.findByText('Summary').click()
  cy.get('#db-run-panel__clear-button').then(($clearButton) => {
    if ($clearButton.is(':disabled')) {
      // Check while bot is running
      cy.findByTestId('dt_mock_summary_card').should('be.visible')
      cy.findByRole('button', { name: 'Stop' }).should('be.visible')
      cy.findByText('Total profit/loss')
        .parent()
        .findByTestId('dt_span')
        .invoke('text')
        .then((text) => {
          cy.log('The total profit/loss is ' + text)
        })
    } else if ($clearButton.is(':visible')) {
      // Check while bot is not running
      cy.findByText('Bot is not running').should('be.visible')
      cy.findByRole('button', { name: 'Run' }).should('be.visible')
      cy.get('#db-run-panel__clear-button').click()
      if (clearPanel)
        cy.findByText('Ok').should('be.visible').click({ force: true })
    }
  })
})

Cypress.Commands.add('c_openDbotThub', () => {
  cy.findByTestId('dt_trading-app-card_real_deriv-bot')
    .findByRole('button', { name: 'Open' })
    .click({ force: true })
  cy.c_loadingCheck()
})

Cypress.Commands.add('c_deleteStrategy', (isMobile = false) => {
  if (isMobile) {
    cy.get('.dc-drawer__toggle').click({ force: true })
    cy.findAllByText('Dashboard').click()
    cy.wait(7000)
    cy.get('.bot-list__item__actions').click()
    cy.findByTestId('dt_mobile_bot_list_action-delete').click()
  } else {
    cy.findAllByText('Dashboard').click()
    cy.findByTestId('dt_desktop_bot_list_action-delete').click()
  }
  cy.findByText('Yes, delete').click({ force: true })
})
