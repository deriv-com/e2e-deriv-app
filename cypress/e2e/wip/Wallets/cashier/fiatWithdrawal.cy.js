import "@testing-library/cypress/add-commands"

describe("WALL-2830 - Fiat withdrawal send email", () => {
  //Prerequisites: Fiat wallet account in qa04 with USD wallet
  beforeEach(() => {
    cy.c_login("doughflow")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to send withdrawal verification link", () => {
    cy.log("Access Fiat Withdrawal Iframe")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.get(".wallets-accordion__header").contains("Withdraw").first().click()
    cy.contains("Please help us verify").should("be.visible")
    if(cy.findByRole('button', { name: 'Send email' }).should("be.visible")){
      cy.findByRole('button', { name: 'Send email' }).click()
    }
    cy.contains("We've sent you an email.")
    cy.findByRole("button", { name: "Didn't receive the email?" }).click()
    cy.contains(/Resend email/)
  })
})

describe("WALL-2830 - Crypto withdrawal content access from email", () => {
    let verification_code = Cypress.env("walletsWithdrawalCode")
    const withdrawal_url = Cypress.env("walletsWithdrawalUrl")
  
    beforeEach(() => {
      cy.c_login("doughflow")
      cy.c_visitResponsive("/wallets", "large")
      cy.contains("Wallet", { timeout: 10000 }).should("exist")
      cy.get(".wallets-accordion__header").contains("Withdraw").first().click()
    })
  
    it("should be able to access doughflow iframe", () => {
      cy.log("Access Fiat Withdrawal Iframe Through Email Link")
      cy.c_emailVerification(verification_code, Cypress.env("qaBoxBaseUrl"))

      cy.then(() => {
        verification_code = Cypress.env("walletsWithdrawalCode")
        cy.log(verification_code)
        Cypress.config("baseUrl")
        cy.c_visitResponsive(
          `${withdrawal_url}?verification=${verification_code}`,
          "large"
        )
        cy.get('#app_contents iframe').should("exist")
      })
    })
  })
