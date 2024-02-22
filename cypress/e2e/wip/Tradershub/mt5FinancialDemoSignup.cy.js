import "@testing-library/cypress/add-commands"

function generate_epoch() {
  return Math.floor(new Date().getTime() / 100000)
}

describe("QATEST-5699: Create a Financial Demo CFD account", () => {
  const epoch = generate_epoch()
  const sign_up_mail = `sanity${epoch}+mt5financialdemo@deriv.com`
  let verification_code

  beforeEach(() => {
    localStorage.setItem("config.server_url", Cypress.env("stdConfigServer"))
    localStorage.setItem("config.app_id", Cypress.env("stdConfigAppId"))
    cy.c_visitResponsive("/endpoint", "desktop")
    cy.findByRole("button", { name: "Sign up" }).should("not.be.disabled")
    cy.c_enterValidEmail(sign_up_mail)
  })
  it("Verify I can signup for a demo financial CFD account", () => {
    cy.wait(5000)
    cy.c_emailVerificationSignUp(
      verification_code,
      Cypress.env("event_email_url"),
      epoch
    )
    cy.then(() => {
      cy.c_visitResponsive("/endpoint", "desktop").then(() => {
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

      verification_code = Cypress.env("emailVerificationCode")
      const today = new Date()
      const signupUrl = `${Cypress.config(
        "baseUrl"
      )}/redirect?action=signup&lang=EN_US&code=${verification_code}&date_first_contact=${
        today.toISOString().split("T")[0]
      }&signup_device=desktop`
      cy.c_visitResponsive(signupUrl, "desktop")
      cy.get("h1").contains("Select your country and").should("be.visible")
      cy.c_selectCountryOfResidence(Cypress.env("CoROnfidoROW"))
      cy.c_selectCitizenship(Cypress.env("citizenshipOnfidoROW"))
      cy.c_enterPassword()
      cy.c_completeOnboarding()
    })
    cy.c_checkTradersHubhomePage()
    cy.findAllByRole("button", { name: "Get" }).eq(1).click()
    cy.findByText("Create a Deriv MT5 password").should("be.visible")
    cy.findByText(
      "You can use this password for all your Deriv MT5 accounts."
    ).should("be.visible")
    cy.findByRole("button", { name: "Create Deriv MT5 password" }).should(
      "be.disabled"
    )
    cy.findByTestId("dt_mt5_password").type(Cypress.env("mt5Password"), {
      log: false,
    })
    cy.findByRole("button", { name: "Create Deriv MT5 password" }).click()
    cy.get(".dc-modal-body").should(
      "contain.text",
      "Success!Congratulations, you have successfully created your demo MT5 Financial account"
    )
    cy.findByRole("button", { name: "Continue" }).click()
    cy.findByText("10,000.00 USD").should("be.visible")
    cy.findByRole("button", { name: "Top up" }).should("exist")
    cy.get("button:nth-child(2)").click()
    cy.get("#modal_root").findByText("Financial Demo").should("be.visible")
  })
})
