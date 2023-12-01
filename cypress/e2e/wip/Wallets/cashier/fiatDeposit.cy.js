import "@testing-library/cypress/add-commands"

describe("WALL-2817 - Fiat deposit iframe access", () => {
  beforeEach(() => {
    cy.c_login("doughflow")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to access doughflow iframe", () => {
    cy.log("Access Fiat Deposit Iframe")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.findAllByText(/USD Wallet/).first().scrollIntoView()
    cy.findByRole('button', { name: 'Deposit' }).click()
    cy.wait(10000) //to account for third party doughflow provider loading time
    cy.contains("iframe")
  })
})

describe("WALL-2817 - Fiat deposit error", () => {
  beforeEach(() => {
    cy.c_login("wallets")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to see error message when no access provided", () => {
    cy.log("Error for Fiat Deposit")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.findAllByText(/USD Wallet/).first().scrollIntoView()
    cy.get('.wallets-button').first().click()
    cy.get(".wallets-action-screen")
      .findByText("Oops, something went wrong!", {
        exact: true,
      })
      .should("be.visible")
  })
})
