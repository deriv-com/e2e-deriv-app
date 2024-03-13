import "@testing-library/cypress/add-commands"

function generate_epoch() {
  return Math.floor(new Date().getTime() / 100000)
}
function createDemoAccount(CoR, Cit, epoch) {
  cy.c_emailVerificationSignUp(epoch)
  cy.then(() => {
    cy.c_visitResponsive("/endpoint", "desktop").then(() => {
      cy.window().then((win) => {
        win.localStorage.setItem(
          "config.server_url",
          Cypress.env("stdConfigServer")
        )
        win.localStorage.setItem("config.app_id", Cypress.env("stdConfigAppId"))
      })
    })
    cy.c_visitResponsive(Cypress.env("signUpUrl"), "desktop")
    cy.get("h1").contains("Select your country and").should("be.visible")
    cy.c_selectCountryOfResidence(CoR)
    cy.c_selectCitizenship(Cit)
    cy.c_enterPassword()
    cy.c_completeOnboarding()
    cy.c_checkTradersHubHomePage()
  })
}
function addRealAccount(identity, taxResi, nationalIDNum, taxIDNum) {
  cy.findByTestId("dt_dropdown_display").click()
  cy.get("#real").click()
  cy.get(".dc-btn").first().click()
  cy.get(".dc-modal-header__close").click()
  cy.findByRole("button", { name: "Yes" }).click()
  cy.findByRole("button", { name: "Get a Deriv account" }).click()
  cy.c_generateRandomName().then((firstName) => {
    cy.c_personalDetails(firstName, identity, taxResi, nationalIDNum, taxIDNum)
  })
  if (identity == "Onfido") {
    cy.contains(
      "Only use an address for which you have proof of residence"
    ).should("be.visible")
  }
  cy.c_addressDetails()
  cy.c_addAccount()
  cy.c_manageAccountsetting(taxResi)
}
function addRealacctfromAcctswitcher() {
  cy.get(".traders-hub-header__setting").click()
  cy.findByTestId("dt_acc_info").click()
  cy.findByText("Real").click()
  cy.findByRole("button", { name: "Add" }).click()
  cy.get("div")
    .filter(':contains("Add a Deriv account")')
    .find('[role="button"]')
    .click()
  cy.findByRole("button", { name: "Yes" }).click()
  cy.findByText("Trader's Hub").click()
}
describe("QATEST-24427,5533,5827 - Cypress test for ROW account sign up", () => {
  let epoch
  let counter = 0
  let countryIDV = Cypress.env("countries").KE
  let nationalIDNumIDV = Cypress.env("nationalIDNum").KE
  let taxIDNumIDV = Cypress.env("taxIDNum").KE
  let countryOnfido = Cypress.env("countries").CO
  let nationalIDNumOnfido = Cypress.env("nationalIDNum").CO
  let taxIDNumOnfido = Cypress.env("taxIDNum").CO

  beforeEach(() => {
    localStorage.setItem("config.server_url", Cypress.env("stdConfigServer"))
    localStorage.setItem("config.app_id", Cypress.env("stdConfigAppId"))
    cy.c_visitResponsive("/endpoint", "desktop")
    cy.findByRole("button", { name: "Sign up" }).should("not.be.disabled")
    //cy.findByRole('button', { name: 'Sign up' }).click()
    counter++
    epoch = generate_epoch() + counter
    cy.log("time is  =" + epoch)
    const sign_up_mail = "sanity" + `${epoch}` + "@binary.com"
    cy.c_enterValidEmail(sign_up_mail)
  })
  it("New account sign up ROW - Onfido supported country", () => {
    createDemoAccount(countryOnfido, countryOnfido, epoch)
    addRealAccount("Onfido", countryOnfido, nationalIDNumOnfido, taxIDNumOnfido)
  })
  it("New account sign up ROW - IDV supported country", () => {
    createDemoAccount(countryIDV, countryIDV, epoch)
    addRealacctfromAcctswitcher()
    addRealAccount("IDV", countryIDV, nationalIDNumIDV, taxIDNumIDV)
  })
})
