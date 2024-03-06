import "@testing-library/cypress/add-commands"

describe("QATEST 54262 - Verify deposit functionality from account switcher", () => {
    it("Should validate the deposit button from account switcher in desktop", () => {
      cy.c_login()
      cy.c_visitResponsive("/appstore/traders-hub", "large")
      cy.c_checkTradersHubhomePage()
      cy.findByTestId("dt_dropdown_display").click()
      cy.get("#real").click()
      cy.close_notification_banner()
      cy.findByRole("button", { name: "Deposit" }).click()
      cy.url().should('include', '/cashier/deposit')
    })
  })
  