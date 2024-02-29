import "@testing-library/cypress/add-commands"

function generate_epoch() {
  return Math.floor(new Date().getTime() / 100000)
}

describe("QATEST-5569: Verify MF Signup flow", () => {
  const epoch = generate_epoch()
  const sign_up_mail = `sanity${epoch}MF@deriv.com`
  let country = Cypress.env("countries").ES
  let nationalIDNum = Cypress.env("nationalIDNum").ES
  let taxIDNum = Cypress.env("taxIDNum").ES
  let currency = Cypress.env("accountCurrency").GBP

  beforeEach(() => {
    localStorage.setItem("config.server_url", Cypress.env("stdConfigServer"))
    localStorage.setItem("config.app_id", Cypress.env("stdConfigAppId"))
    cy.c_visitResponsive("/endpoint", "desktop")
    cy.findByRole("button", { name: "Sign up" }).should("not.be.disabled")
    cy.c_enterValidEmail(sign_up_mail)
  })
  it("Verify I can signup for an MF demo and real account", () => {
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

      // cy.c_visitResponsive(Cypress.env("signUpUrl"), "desktop")
      cy.get("h1").contains("Select your country and").should("be.visible")
      cy.c_selectCountryOfResidence(country)
      cy.c_selectCitizenship(country)
      cy.c_enterPassword()
    })
    cy.c_generateRandomName().then((firstName) => {
      cy.c_personalDetails(
        firstName,
        "MF",
        country,
        nationalIDNum,
        taxIDNum,
        currency
      )
    })
    cy.c_addressDetails()
    cy.c_completeTradingAssessment()
    cy.c_completeFinancialAssessment()
    cy.c_addAccountMF()
    cy.get("#traders-hub").scrollIntoView({ position: "top" })
    cy.findByText("Total assets").should("be.visible")
    cy.findByText("0.00").should("be.visible")
    cy.c_manageAccountsetting(country)
  })
})
