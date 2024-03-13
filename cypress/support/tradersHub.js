export function generateEpoch() {
    return Math.floor(new Date().getTime() / 100000)
  }

Cypress.Commands.add("c_checkTradersHubHomePage", () => {
    cy.findByText("Options & Multipliers").should("be.visible")
    cy.findByText("CFDs").should("be.visible")
    cy.findAllByText("Deriv cTrader").eq(0).scrollIntoView({ position: 'bottom' }).should("be.visible")
    cy.findByText('Other CFD Platforms').scrollIntoView({ position: 'bottom' })
    cy.get("#traders-hub").scrollIntoView({ position: "top" })
})

Cypress.Commands.add("c_switchToReal", () => {
    cy.findByTestId("dt_dropdown_display").click()
    cy.get("#real").click()
})

Cypress.Commands.add("c_completeTradersHubTour", () => {
    cy.findByRole('button', { name: 'Next' }).click()
    cy.findByRole('button', { name: 'OK' }).click()
})