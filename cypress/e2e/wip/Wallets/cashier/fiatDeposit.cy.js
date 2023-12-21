import "@testing-library/cypress/add-commands"

describe("WALL-2817 - Fiat deposit iframe access", () => {
  //Prerequisites: Fiat wallet account in qa04 with USD wallet
  beforeEach(() => {
    cy.c_login("doughflow")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to access doughflow iframe", () => {
    cy.log("Access Fiat Deposit Iframe")
    cy.c_rateLimit()
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.get(".wallets-accordion__header").contains("Deposit").first().click()
    cy.get('#app_contents iframe').should("exist")
  })
})

describe("WALL-2817 - Fiat deposit error", () => {
  //Prerequisites: Fiat wallet account in qa box besides qa04 with USD wallet
  beforeEach(() => {
    cy.c_login("wallets")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to see error message when no access provided", () => {
    cy.log("Error for Fiat Deposit")
    cy.c_rateLimit()
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.get(".wallets-accordion__header").contains("Deposit").first().click()
    cy.get(".wallets-action-screen")
      .findByText("Oops, something went wrong!", {
        exact: true,
      })
      .should("be.visible")
  })
})
