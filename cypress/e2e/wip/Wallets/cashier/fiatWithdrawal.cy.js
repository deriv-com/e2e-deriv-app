import "@testing-library/cypress/add-commands"

describe("WALL-2830 - Fiat withdrawal send email", () => {
    beforeEach(() => {
        cy.c_login("doughflow")
        cy.c_visitResponsive("/wallets", "large")
    })
    
    it("should be able to send withdrawal verification link", () => {
        cy.log("Access Fiat Withdrawal Iframe")
        cy.contains("Wallet", { timeout: 10000 }).should("exist")
        cy.get(".wallets-accordion__header").contains("Withdraw").first().click()
        cy.contains("Send email").click()
        cy.contains("We’ve sent you an email.")
        cy.findByRole('button', { name: 'Didn’t receive the email?' }).click()
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
      cy.get(".wallets-accordion__header").contains("Withdraw").first().click()
    })
  
    it("should be able to access doughflow iframe", () => {
      cy.log("Access Fiat Withdrawal Iframe Through Email Link")
      cy.visit(
        `https://${Cypress.env("qaBoxLoginEmail")}:${Cypress.env(
          "qaBoxLoginPassword"
        )}@${Cypress.env("qaBoxBaseUrl")}`
      )
      cy.origin(
        `https://${Cypress.env("qaBoxLoginEmail")}:${Cypress.env(
          "qaBoxLoginPassword"
        )}@${Cypress.env("qaBoxBaseUrl")}`,
        async () => {
          await cy.scrollTo("bottom");
          await cy.get("a").last().click();
          await cy
            .get("a")
            .eq(1)
            .invoke("attr", "href")
            .then((href) => {
              const code = href.match(/code=([A-Za-z0-9]{8})/)
              if (code) {
                verification_code = code[1]
                Cypress.env("walletsWithdrawalCode", verification_code)
                cy.log(verification_code)
                cy.log(Cypress.env("walletsWithdrawalCode"))
              } else {
                cy.log("Unable to find code in the URL")
              }
            })
        }
      )
  
      cy.then(() => {
        cy.log(Cypress.env("walletsWithdrawalCode"))
        Cypress.config("baseUrl")
        cy.c_visitResponsive(
          `${withdrawal_url}?verification=${verification_code}`,
          "large"
        )
        cy.wait(10000) //to account for third party doughflow provider loading time
        cy.contains("iframe")
      })
    })
  })
