import "@testing-library/cypress/add-commands"

describe("WALL-2830 - Crypto withdrawal send email", () => {
  beforeEach(() => {
    cy.c_login("wallets")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to send withdrawal verification link", () => {
    cy.log("Send Crypto Withdrawal Verification")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.findAllByText(/BTC Wallet/).first().scrollIntoView()
    cy.findByRole('button', { name: 'Withdraw' }).click()
    cy.contains("Please help us verify")
    cy.findByRole('button', { name: 'Send email' }).click().click()
    cy.contains("We’ve sent you an email.")
    cy.findByRole('button', { name: 'Didn\'t receive the email?' }).click()
    cy.contains(/Resend email/)
  })
})

describe("WALL-2830 - Crypto withdrawal content access from email", () => {
  let verification_code = Cypress.env("walletsWithdrawalCode")
  const withdrawal_url = Cypress.env("walletsWithdrawalUrl")

  beforeEach(() => {
    cy.c_login("wallets")
    cy.c_visitResponsive("/wallets", "large")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.findAllByText(/BTC Wallet/).first().scrollIntoView()
    cy.findByRole('button', { name: 'Withdraw' }).click()
  })

  it("should be able to access crypto withdrawal content and perform withdrawal", () => {
    cy.log("Access Crypto Withdrawal Content Through Email Link")
    cy.c_emailVerification(verification_code, Cypress.env("mainQaBoxBaseUrl"))

    cy.then(() => {
      Cypress.config("baseUrl")
      cy.c_visitResponsive(
        `${withdrawal_url}?verification=${verification_code}`,
        "large"
      )
      cy.contains("Transaction status")
      cy.contains("Your Bitcoin cryptocurrency wallet address").click().type(
        "1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71" //Example bitcoin wallet address
      )
      cy.contains("0% of available balance")
      cy.contains("Amount (BTC)").click().type("0.005")
      cy.get("form").findByRole("button", { name: "Withdraw" }).click()
      cy.contains("0.00500000 BTC", { exact: true })
      cy.contains("Your withdrawal is currently in process")
      cy.findByRole("button", { name: "Close" }).click()
      cy.contains("Please help us verify")
    })
  })
})
