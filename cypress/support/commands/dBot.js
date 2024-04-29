Cypress.Commands.add('c_switchToDemoBot', () => {
  cy.get('div.acc-info').click({ force: true })
  cy.xpath("//li[text()='Demo']").click()
  cy.xpath("//span[@class='acc-switcher__id']/span[text()='Demo']").click()
  cy.get('div.acc-info').should('be.visible')
})

Cypress.Commands.add('c_runBot', () => {
  cy.get('.bot-dashboard.bot').should('be.visible')
  cy.get("button[id='db-animation__run-button']").click()
})

Cypress.Commands.add('c_stopBot', (waitduration = undefined) => {
  if (waitduration) {
    cy.wait(waitduration)
  }
  cy.get("button[id='db-animation__stop-button']").should('exist').click()
})

Cypress.Commands.add('c_setBlockDuration', () => {
  cy.xpath(
    "(//*[@class='blocklyText' and text()='Duration:']/..)/*[@class='blocklyEditableText']"
  ).click()
  cy.get('.goog-menuitem.goog-option').contains('Ticks').click()
  cy.xpath(
    "((//*[@class='blocklyText' and text()='Duration:']/..)//*[@data-argument-type='text number'])[1]"
  ).type('2')
})
