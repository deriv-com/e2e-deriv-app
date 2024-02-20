import "@testing-library/cypress/add-commands"

const regulationText = ".regulators-switcher__switch div.item.is-selected"
function generate_epoch() {
  return Math.floor(new Date().getTime() / 100000)
}

describe("QATEST-5554: Verify DIEL Signup flow - CR + MF", () => {
  const epoch = generate_epoch()
  const sign_up_mail = `sanity${epoch}diel@deriv.com`
  let verification_code

  beforeEach(() => {
    localStorage.setItem("config.server_url", Cypress.env("stdConfigServer"))
    localStorage.setItem("config.app_id", Cypress.env("stdConfigAppId"))
    cy.c_visitResponsive("/endpoint", "desktop")
    cy.findByRole("button", { name: "Sign up" }).should("not.be.disabled")
    cy.c_enterValidEmail(sign_up_mail)
  })
  it("Verify I can signup for a DIEL demo and real account", () => {
    Cypress.env("citizenship", Cypress.env("dielCountry"))
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
      cy.c_selectCountryOfResidence(Cypress.env("dielCountry"))
      cy.c_selectCitizenship(Cypress.env("dielCountry"))
      cy.c_enterPassword()
      cy.c_completeOnboarding()
    })
    cy.c_checkTradersHubhomePage()
    cy.findByTestId("dt_dropdown_display").click()
    cy.get("#real").click()
    cy.get(regulationText).should("have.text", "Non-EU")
    cy.findByRole("button", { name: "Get a Deriv account" }).click()
    cy.c_generateRandomName().then((firstName) => {
      cy.c_personalDetails(firstName, "Onfido", Cypress.env("dielCountry"))
    })
    cy.contains(
      "Only use an address for which you have proof of residence"
    ).should("be.visible")
    cy.c_addressDetails()
    cy.c_addAccount()
    cy.findByText("EU", { exact: true }).click()
    cy.get(regulationText).should("have.text", "EU")
    cy.findByRole("button", { name: "Get a Deriv account" }).click()
    cy.findByText("US Dollar").click()
    cy.findByRole("button", { name: "Next" }).click()
    cy.get('[type="radio"]').first().click({ force: true })
    cy.findByTestId("dt_personal_details_container")
      .findAllByTestId("dt_dropdown_display")
      .eq(0)
      .click()
    cy.get("#Employed").click()
    cy.get(".dc-checkbox__box").click()
    cy.findByRole("button", { name: "Next" }).click()
    cy.findByRole("button", { name: "Next" }).click()
    cy.c_completeTradingAssessment()
    cy.c_completeFinancialAssessment()
    cy.c_addAccountMF()
    cy.c_manageAccountsetting(Cypress.env("dielCountry"))
  })
})
