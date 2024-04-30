Cypress.Commands.add('c_switchToDemoBot', () => {
  cy.findByTestId('dt_acc_info').click()
  cy.xpath("//li[text()='Demo']").click()
  cy.xpath("//span[@class='acc-switcher__id']/span[text()='Demo']").click()
  cy.findByTestId('dt_acc_info').should('be.visible')
})

Cypress.Commands.add('c_runBot', () => {
  cy.get('.bot-dashboard.bot').should('be.visible')
  cy.findAllByRole('button', { name: 'Run' }).click()
})

Cypress.Commands.add('c_stopBot', (waitduration = undefined) => {
  if (waitduration) {
    cy.wait(waitduration)
  }
  cy.findAllByRole('button', { name: 'Stop' }).click()
})

Cypress.Commands.add('c_setBlockDuration', () => {
  cy.xpath(
    "(//*[@class='blocklyText' and text()='Duration:']/..)/*[@class='blocklyEditableText']"
  ).click()
  cy.findByRole('menuitemcheckbox', { name: 'Ticks' }).click()
  cy.findByRole('textbox').nth(1).type('2')
})

Cypress.Commands.add('c_skipTour', () => {
  cy.findByText('Skip').should('be.visible').click({ force: true })
})
