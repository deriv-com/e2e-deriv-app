import "@testing-library/cypress/add-commands"

function generate_epoch() {
    return Math.floor(new Date().getTime() / 100000)
  }

describe("QATEST-5724: CFDs - Create a demo Financial account using existing MT5 account password", () => {
    const epoch = generate_epoch()
    const sign_up_mail = `sanity${epoch}mt5derived@deriv.com`
    let country = Cypress.env("countries").CO

    beforeEach(() => {
      localStorage.setItem("config.server_url", Cypress.env("stdConfigServer"))
      localStorage.setItem("config.app_id", Cypress.env("stdConfigAppId"))
      cy.c_visitResponsive("/endpoint", "desktop")
      cy.findByRole("button", { name: "Sign up" }).should("not.be.disabled")
      cy.c_enterValidEmail(sign_up_mail)
    })

 it("Verify I can signup for a demo derived CFD account", () => {
    cy.c_emailVerificationSignUp(epoch)
    cy.then(() => {
        cy.c_visitResponsive(Cypress.env("signUpUrl"), "desktop").then(() => {
        cy.window().then((win) => {
          win.localStorage.setItem(
            "config.server_url",
            Cypress.env("stdConfigServer")
          )
          win.localStorage.setItem(
            "config.app_id",
            Cypress.env("stdConfigAppId")
          )
        })
      })

      cy.c_visitResponsive(Cypress.env("signUpUrl"), "desktop")
      cy.get("h1").contains("Select your country and").should("be.visible")
      cy.c_selectCountryOfResidence(country)
      cy.c_selectCitizenship(country)
      cy.c_enterPassword()
      cy.c_completeOnboarding()
    })
    cy.c_checkTradersHubhomePage()
    cy.findAllByRole("button", { name: "Get" }).first().click()
    cy.findByText("Create a Deriv MT5 password").should("be.visible")
    cy.findByText(
      "You can use this password for all your Deriv MT5 accounts."
    ).should("be.visible")

    cy.findByTestId("dt_mt5_password").type(Cypress.env("mt5Password"), {
      log: false,
    })
    cy.findByRole("button", { name: "Create Deriv MT5 password" }).click()
    cy.findByRole("heading", { name: "Success!" }).should("be.visible")
    cy.get(".dc-modal-body").should(
        "contain.text",
        "Success!Congratulations, you have successfully created your demo Deriv MT5 Derived account")
    cy.findByRole("button", { name: "Continue" }).click()
    cy.findByText("10,000.00 USD").should("be.visible")
    cy.findByRole("button", { name: "Top up" }).should("exist")
    cy.findAllByRole('button', { name: 'Get' }).eq(0).click()
    cy.findByText('Enter your Deriv MT5 password').should("be.visible")
    cy.findByText('Enter your Deriv MT5 password to add a MT5 Demo Financial account.').should("be.visible")
    cy.findByRole("button", { name: "Add account" }).should("be.disabled")
    cy.findByRole("button", { name: "Forgot password?" }).should("be.visible")
    cy.findByTestId("dt_mt5_password").type(Cypress.env("mt5Password"), {
        log: false,
      })
    cy.findByRole("button", { name: "Add account" }).click()
    cy.get(".dc-modal-body").should(
        "contain.text",
        "Success!Congratulations, you have successfully created your demo Deriv MT5 Financial account.")
    cy.findByRole("button", { name: "Continue" }).click()
    cy.findAllByText("10,000.00 USD").eq(1).should("be.visible")
    cy.findAllByRole("button", { name: "Top up" }).eq(1).should("exist")
    cy.get(".trade-button").eq(1).click()
    cy.get("#modal_root").findByText("Financial Demo").should("be.visible")
  })
})