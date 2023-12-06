import "@testing-library/cypress/add-commands"

function fiat_transfer(to_account) {
  cy.contains("Transfer to").click()
  cy.contains(`${to_account} Wallet`).click()
  cy.get('input[class="wallets-atm-amount-input__input"]')
    .eq(1)
    .click()
    .type("1.000")
  cy.get("form")
    .findByRole("button", { name: "Transfer", exact: true })
    .should("be.enabled")
    .click()
  cy.findByText("Your transfer is successful!", {
    exact: true,
  }).should("be.visible")
  cy.contains("10.00 USD")
  cy.contains("% transfer fees")
  cy.findByRole("button", { name: "Make a new transfer" }).click()
}

describe("WALL-2858 - Fiat transfer and transactions", () => {
  beforeEach(() => {
    cy.c_login("wallets")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to perform transfer from fiat account", () => {
    cy.log("Transfer from Fiat account")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.findAllByText(/USD Wallet/).first().scrollIntoView()
    cy.get('.wallets-accordion__dropdown').first().click()
    cy.contains("Transfer").first().click()
    fiat_transfer("BTC")
    fiat_transfer("ETH")
    fiat_transfer("LTC")
  })

  it("should be able to view transactions of fiat account", () => {
    cy.log("View Transactions of Fiat account")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.findAllByText(/USD Wallet/).first().scrollIntoView()
    cy.get('.wallets-accordion__dropdown').first().click()
    cy.contains("Transactions").first().click()
    cy.get("#downshift-0-toggle-button").findByRole("button").click()
    cy.findByRole("option", { name: "Deposit" }).click()
    cy.contains("+10,000.00 USD")
    cy.get("#downshift-0-toggle-button").findByRole("button").click()
    cy.findByRole("option", { name: "Withdrawal" }).click()
    cy.contains("No recent transactions")
    cy.get("#downshift-0-toggle-button").findByRole("button").click()
    cy.findByRole("option", { name: "Transfer" }).click()
    cy.contains("LTC Wallet")
    cy.contains("ETH Wallet")
    cy.contains("BTC Wallet")
    cy.contains("-10.00 USD")
  })
})
