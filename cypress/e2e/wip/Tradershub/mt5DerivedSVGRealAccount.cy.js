import "@testing-library/cypress/add-commands"

function generate_epoch() {
  return Math.floor(new Date().getTime() / 100000)
}

describe("QATEST-5972: Create a Derived SVG account", () => {
  const epoch = generate_epoch()
  const sign_up_mail = `sanity${epoch}+mt5derivedsvg@deriv.com`
  let country = Cypress.env("countries").CO
  let nationalIDNum = Cypress.env("nationalIDNum").CO
  let taxIDNum = Cypress.env("taxIDNum").CO

  beforeEach(() => {
    localStorage.setItem("config.server_url", Cypress.env("stdConfigServer"))
    localStorage.setItem("config.app_id", Cypress.env("stdConfigAppId"))
    cy.c_visitResponsive("/endpoint", "desktop")
    cy.findByRole("button", { name: "Sign up" }).should("not.be.disabled")
    cy.c_enterValidEmail(sign_up_mail)
  })
  it("Verify I can signup for a real derived SVG CFD account", () => {
    cy.c_emailVerificationSignUp(epoch)
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

      cy.c_visitResponsive(Cypress.env("signUpUrl"), "desktop")
      cy.get("h1").contains("Select your country and").should("be.visible")
      cy.c_selectCountryOfResidence(country)
      cy.c_selectCitizenship(country)
      cy.c_enterPassword()
      cy.c_completeOnboarding()
    })
    cy.c_checkTradersHubhomePage()
    cy.findByTestId("dt_dropdown_display").click()
    cy.get("#real").click()
    //Create real account
    cy.findByRole("button", { name: "Get a Deriv account" }).click()
    cy.c_generateRandomName().then((firstName) => {
      cy.c_personalDetails(
        firstName,
        "Onfido",
        country,
        nationalIDNum,
        taxIDNum
      )
    })
    cy.contains(
      "Only use an address for which you have proof of residence"
    ).should("be.visible")
    cy.c_addressDetails()
    cy.c_addAccount()
    //Create real Mt5 derived SVG account
    cy.findAllByRole("button", { name: "Get" }).first().click()
    cy.findByText("St. Vincent & Grenadines").click()
    cy.findByRole("button", { name: "Next" }).click()
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
      "Success!Congratulations, you have successfully created your real  Deriv MT5 Derived SVG account. To start trading, top-up funds from your Deriv account into this account."
    )
    cy.findByRole("button", { name: "Transfer now" }).should("exist")
    cy.findByRole("button", { name: "Maybe later" }).click()
    cy.findByText("0.00 USD").should("be.visible")
    cy.findByRole("button", { name: "Transfer" }).should("exist")
    cy.get("button:nth-child(2)").click()
    cy.get("#modal_root").findByText("Derived SVG").should("be.visible")
    cy.get("#modal_root").findByText("Deriv (SVG) LLC").should("be.visible")
  })
})
