import "@testing-library/cypress/add-commands"

describe("WALL-2831 - Crypto deposit and fiat onramp", () => {
  //Prerequisites: Crypto wallet account with access to banxa provider in any qa box with app id 11780
  beforeEach(() => {
    cy.c_login("onramp")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to view crypto deposit details", () => {
    cy.log("Crypto Deposit")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.findAllByText(/BTC Wallet/).first().scrollIntoView()
    cy.findByRole('button', { name: 'Deposit' }).click()
    cy.get("canvas").should("be.visible")
    cy.contains("Transaction status")
    cy.contains(/To avoid loss of funds/)
    cy.get(".wallets-clipboard").click()
    cy.contains("Copied")
    cy.findByText("Try Fiat onramp").click()
    cy.contains("Banxa")
  })

  it("should be able to deposit into crypto account through fiat onramp", () => {
    cy.log("Access Fiat OnRamp Provider")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.findAllByText(/BTC Wallet/).first().scrollIntoView()
    cy.findByRole('button', { name: 'Deposit' }).click()
    cy.findByText("Try Fiat onramp").click()
    cy.contains("Banxa")
    cy.findByRole("button", { name: "Select" }).click()
    cy.contains("Disclaimer")
    cy.findByRole("button", { name: "Back" }).click()
    cy.findByRole("button", { name: "Select" }).click()
    cy.findByRole("button", { name: "Continue" })
      .should("be.enabled")
      .invoke("removeAttr", "target")
      .click()
    //TODO: check if banxa provider tab is properly loaded and banxa url is able to be fetched
    // cy.url().should("include", "Cypress.env("onrampProviderUrl")");
  })
})
