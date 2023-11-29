import "@testing-library/cypress/add-commands"

function reset_balance_demo() {
  cy.findByText("Demo").scrollIntoView()
  cy.get('[class*="virtual"].wallets-accordion__header--virtual')
    .find(".wallets-accordion__dropdown > svg")
    .click()
  cy.findByRole("button", { name: "Reset balance" }).click()
  cy.get('[class="wallets-cashier-content"]')
    .findByRole("button", { name: "Reset balance" })
    .click()
  cy.findByText("Success").should("exist")
  cy.findByRole("button", { name: "Transfer funds" }).click()
  //To check if Transfer tab is active on clicking Transfer funds
  cy.get('[class*="wallets-cashier-header__tab"].wallets-cashier-header__tab')
    .contains("Transfer")
    .parent()
    .should("be.visible")
    .invoke("attr", "class") //would return the string of that class
    .should("include", "wallets-cashier-header__tab--active") //find if the class has "active" string
}

describe("WALL-2760 - Reset Balance for Demo wallet", () => {
  beforeEach(() => {
    cy.c_login("wallets")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to reset balance for demo wallet", () => {
    cy.log("Reset Balance for Demo Account")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    reset_balance_demo()
  })

  it("should be able to transfer demo funds", () => {
    cy.log("Transfer Demo Funds for Demo Account")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.findByText("Demo").scrollIntoView()
    cy.get('[class*="virtual"].wallets-accordion__header--virtual')
      .find(
        ".wallets-list-header__card_container > .wallets-list-header__content > .wallets-list-header__details-container > .wallets-list-details__action-container > .wallets-header__actions > button"
      )
      .first()
      .click()
    cy.findByRole("button", {
      name: "Transfer from USD Wallet Balance: 10,000.00 USD Demo",
    }).click()
    cy.findByRole("button", {
      name: "USD Wallet Balance: 10,000.00 USD Demo",
      exact: true,
    }).click()
    cy.findByRole("button", {
      name: "Transfer to Select a trading account or a Wallet",
    }).click()
    cy.findByRole("button", {
      name: "Deriv X Balance: 10,000.00 USD Demo",
      exact: true,
    }).click()
    cy.get('input[class="wallets-atm-amount-input__input"]')
      .eq(1)
      .click()
      .type("1.000")
    cy.get(
      'button[class="wallets-button wallets-button__size--lg wallets-button__variant--contained wallets-button__rounded--sm wallets-button__color--primary"]'
    )
      .should("be.enabled")
      .click()
    cy.findByText("Your transfer is successful!", {
      exact: true,
    }).should("be.visible")
    cy.findByRole("button", { name: "Make a new transfer" }).click()
    cy.findByRole("button", {
      name: "Transfer from USD Wallet Balance: 9,990.00 USD Demo",
    }).should("be.visible")
  })

  it("should be able to view demo transactions", () => {
    cy.log("View Transactions for Demo Account")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.findByText("Demo").scrollIntoView()
    cy.get('[class*="virtual"].wallets-accordion__header--virtual')
      .find(
        ".wallets-list-header__card_container > .wallets-list-header__content > .wallets-list-header__details-container > .wallets-list-details__action-container > .wallets-header__actions > button"
      )
      .eq(1)
      .click()
    cy.get("#downshift-0-toggle-button").findByRole("button").click()
    cy.findByRole("option", { name: "Reset balance" }).click()
    cy.contains("+10,000.00 USD")
    cy.get("[class=wallets-textfield__box").click()
    cy.findByRole("option", { name: "Transfer" }).click()
    cy.contains("-10.00 USD")
  })
})
