import "@testing-library/cypress/add-commands"

describe("WALL-XXXX - Fiat withdrawal send email", () => {
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

describe("WALL-XXXX - Fiat withdrawal iframe access from email", { baseUrl: null }, () => {
    beforeEach(() => {
        cy.c_qaboxlogin()
    })
  
    it("should be able to access doughflow iframe", () => {
      cy.log("Access Fiat Withdrawal Iframe Through Email Link")
      cy.findByRole('link', { name: /Rudderstack_request_payment_withd/ }).click()
      cy.findByRole('link', { name: /test-app.deriv.com/ }).click();
      cy.wait(10000) //to account for third party doughflow provider loading time
      cy.contains("iframe")
    })
})