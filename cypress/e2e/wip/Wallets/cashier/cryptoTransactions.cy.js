import "@testing-library/cypress/add-commands"

function crypto_transfer(to_account) {
  cy.contains("Transfer to").click();
  cy.contains(`${to_account} Wallet`).click();
  cy.get('input[class="wallets-atm-amount-input__input"]')
    .eq(1)
    .click()
    .type("0.000010000")
  cy.get("form")
    .findByRole("button", { name: "Transfer", exact: true })
    .should("be.enabled")
    .click()
  cy.findByText("Your transfer is successful!", {
    exact: true,
  }).should("be.visible")
  cy.contains("0.00010000 BTC")
  cy.contains("% transfer fees")
  cy.findByRole("button", { name: "Make a new transfer" }).click()
}

describe("WALL-2858 - Crypto transfer and transactions", () => {
  beforeEach(() => {
    cy.c_login("wallets")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to perform transfer from crypto account", () => {
    cy.log("Transfer from Crypto account")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.findAllByText(/BTC Wallet/).first().scrollIntoView()
    cy.contains("Transfer").first().click()
    crypto_transfer("USD")
    crypto_transfer("ETH")
    crypto_transfer("LTC")
  })

  it("should be able to view transactions of crypto account", () => {
    cy.log("View Transactions of Crypto account")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.findAllByText(/BTC Wallet/).first().scrollIntoView()
    cy.contains("Transactions").first().click()
    cy.get("#downshift-0-toggle-button").findByRole("button").click()
    cy.findByRole("option", { name: "Deposit" }).click()
    cy.contains("+1.00000000 BTC")
    cy.get("#downshift-0-toggle-button").findByRole("button").click()
    cy.findByRole("option", { name: "Withdrawal" }).click()
    cy.contains("No recent transactions")
    cy.get("#downshift-0-toggle-button").findByRole("button").click()
    cy.findByRole("option", { name: "Transfer" }).click()
    cy.contains("LTC Wallet")
    cy.contains("ETH Wallet")
    cy.contains("USD Wallet")
    cy.contains("-0.00010000 BTC")
  })
})
