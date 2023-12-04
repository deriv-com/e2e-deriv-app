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

const email = Cypress.env('qaBoxLoginEmail')
const password = Cypress.env('qaBoxLoginPassword')
const base_url = Cypress.env('qaBoxBaseUrl') //base url in .env should not contain 'https://'

describe("WALL-2830 - Fiat withdrawal iframe access from email", () => {
    beforeEach(() => {
        cy.c_visitResponsive(`https://${email}:${password}@${base_url}`, 'large')
    })
  
    it("should be able to access doughflow iframe", () => {
      cy.log("Access Fiat Withdrawal Iframe Through Email Link")
      cy.scrollTo('bottom')
      cy.findByRole('link', { name: /Rudderstack_request_payment/ }).last().click()
      cy.findByRole('link', { name: /action=payment_withdraw/ }).click();
      cy.wait(10000) //to account for third party doughflow provider loading time
      cy.contains("iframe")
    })
})
