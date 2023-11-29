import "@testing-library/cypress/add-commands"

describe("QATEST-9999 - <Clickup description here>", () => {
  beforeEach(() => {
    cy.c_login("doughflow")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to access doughflow iframe", () => {
    cy.log("Access Fiat Deposit Iframe")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.get(".wallets-accordion__header")
      .find(
        ".wallets-list-header__card_container > .wallets-list-header__content > .wallets-list-header__details-container > .wallets-list-details__action-container > .wallets-header__actions > button"
      )
      .first()
      .click()
    cy.wait(10000)
    cy.contains("iframe")
  })
})

describe("QATEST-9999 - <Clickup description here>", () => {
  beforeEach(() => {
    cy.c_login("wallets")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to see error message when no access provided", () => {
    cy.log("Error for Fiat Deposit")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.get(".wallets-accordion__header")
      .find(
        ".wallets-list-header__card_container > .wallets-list-header__content > .wallets-list-header__details-container > .wallets-list-details__action-container > .wallets-header__actions > button"
      )
      .first()
      .click()
    cy.get(".wallets-action-screen")
      .findByText("Oops, something went wrong!", {
        exact: true,
      })
      .should("be.visible")
  })
})
