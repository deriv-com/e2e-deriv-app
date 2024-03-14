export function generateEpoch() {
    return Math.floor(new Date().getTime() / 100000)
  }

Cypress.Commands.add("c_checkTradersHubHomePage", () => {
    cy.findByText("Options & Multipliers").should("be.visible")
    cy.findByText("CFDs").should("be.visible")
    cy.findAllByText("Deriv cTrader").eq(0).should("be.visible")
    cy.findByText('Other CFD Platforms').scrollIntoView({ position: 'bottom' })
    cy.get("#traders-hub").scrollIntoView({ position: "top" })
})

Cypress.Commands.add("c_switchToReal", () => {
    cy.findByTestId("dt_dropdown_display").click()
    cy.get("#real").click()
})

Cypress.Commands.add("c_validateEUDisclaimer", () => {
    cy.findByTestId("dt_traders_hub_disclaimer").should('be.visible')
    cy.findByText('EU statutory disclaimer')
    cy.findByText('70.1% of retail investor accounts lose money when trading CFDs with this provider').should('be.visible') 
})