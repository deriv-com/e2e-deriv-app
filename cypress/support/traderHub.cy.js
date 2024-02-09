Cypress.Commands.add('c_checkTradersHubhomePage',() => {
  cy.findByText('Total assets').should('be.visible')
  cy.findByText('Options & Multipliers').should('be.visible')
  cy.findByText('CFDs').should('be.visible')
  cy.findByText('Deriv cTrader').should('be.visible')    
  cy.contains('Other CFD Platforms').scrollIntoView().should('be.visible') 
  cy.get('#traders-hub').scrollIntoView({ position: 'top' }) 
  })

Cypress.Commands.add("c_completePersonalDetails"),() => {
  cy.findByTestId('dt_dropdown_display').click()
  cy.get('#real').click()
  cy.findByRole('button', { name: 'Get a Deriv account' }).click()
  cy.findByText('US Dollar').click()
  cy.findByRole('button', { name: 'Next' }).click()
  cy.findByText('Any information you provide').should('be.visible')
  cy.findByTestId('first_name').type('Cypress')
  cy.findByTestId('last_name').type('testaccount')
  cy.findByTestId('date_of_birth').click()
  cy.findByText('2006').click()
  cy.findByText('Feb').click()
  cy.findByText('9', { exact: true }).click()
}