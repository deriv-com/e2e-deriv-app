import '@testing-library/cypress/add-commands'

describe('WALL-3591 -production bug WALL-3588', () => {
  beforeEach(() => {
    cy.c_login()
  })

  it('should remain logged in after redirection to another platform', () => {
    cy.c_visitResponsive("/appstore/traders-hub", "large")
    cy.findAllByRole("button", { name: "Open" }).eq(1).click({ force: true })
    cy.findByText("Get started on Deriv Bot", { timeout: 15000 }).should(
      "be.visible"
    )
    if (Cypress.config().baseUrl.includes("staging"))
      cy.url().should("eql", dBotStagingUrl)
    else cy.url().should("eql", dBotProdUrl)
  })

})