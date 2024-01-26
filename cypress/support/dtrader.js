
Cypress.Commands.add("c_selectSymbol", (symbolName) => {
    cy.get('.cq-symbol-select-btn', { timeout: 20000 }).should('be.visible')
    cy.get('.cq-symbol-select-btn').click()
    cy.get('.ic-icon.sc-mcd__filter__group-icon.sc-mcd__filter__group-icon--open').should('be.visible')
    cy.findByText('Synthetics').should('be.visible').click()
    cy.contains('div.sc-mcd__item__name', symbolName).click()
  })
  
  
  Cypress.Commands.add("c_selectTradeType", (category,tradeType) => {
    cy.findByTestId('dt_contract_dropdown').click()
    cy.findByText(category).click()
    cy.findByText(tradeType).should('be.visible').click()
  })