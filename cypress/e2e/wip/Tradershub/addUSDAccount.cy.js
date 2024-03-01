import "@testing-library/cypress/add-commands"

function generate_epoch() {
    return Math.floor(new Date().getTime() / 100000)
  }

describe("QATEST-Add USD account for existing BTC account", () => {
    const epoch = generate_epoch()
    const sign_up_mail = `sanity${epoch}crypto@deriv.com`
  
    beforeEach(() => {
      localStorage.setItem("config.server_url", Cypress.env("stdConfigServer"))
      localStorage.setItem("config.app_id", Cypress.env("stdConfigAppId"))
      cy.c_visitResponsive("/endpoint", "desktop")
      cy.findByRole("button", { name: "Sign up" }).should("not.be.disabled")
      cy.c_enterValidEmail(sign_up_mail)
    })
 
it("Create new crypto account", () => {

    Cypress.env("citizenship", Cypress.env("crCountry"))
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
    cy.c_selectCountryOfResidence(Cypress.env("crCountry"))
    cy.c_selectCitizenship(Cypress.env("crCountry"))
    cy.c_enterPassword()
    cy.c_completeOnboarding()
    })
    cy.c_checkTradersHubhomePage()
    cy.findByTestId("dt_dropdown_display").click()
    cy.get("#real").click()
    cy.findByRole("button", { name: "Get a Deriv account" }).click()
    //cy.findByRole('textbox', { name: 'Choose the document type' }).click()
    //cy.findByText('I want to do this later').click()*/
    //cy.c_personalDetails(firstName, "IDV", Cypress.env("crCountry"))
    //cy.c_addressDetails()
    //cy.c_addAccount()
    cy.c_generateRandomName().then((firstName) => {
          cy.c_personalDetails(firstName, "IDV", Cypress.env("crCountry"))
        })
    cy.c_addressDetails()
    cy.c_addAccount()
       /* cy.contains(
          "Only use an address for which you have proof of residence"
        ).should("be.visible")
        cy.c_addressDetails()
        cy.c_addAccount()
        cy.findByText("EU", { exact: true }).click()
        cy.get(regulationText).should("have.text", "EU")
        cy.findByRole("button", { name: "Get a Deriv account" }).click()*/
   
     /*   cy.findByText("Bitcoin").click()
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
        cy.c_manageAccountsetting(Cypress.env("crCountry"))
    */
        cy.c_checkTradersHubhomePage()
        cy.close_notification_banner()
        cy.findByTestId('dt_currency-switcher__arrow').click()
        cy.findByRole('button', { name: 'Add or manage account' }).click()
        cy.findByText('Fiat currencies').click()
        cy.findByText('US Dollar').click()
        cy.findByRole('button', { name: 'Add account' }).click()
        cy.findByRole('heading', { name: 'Success!' }).should('be.visible', { timeout: 30000 }) 
        cy.findByText('You have added a USD account.').should("be.visible")
        cy.findByRole('button', { name: 'Maybe later' }).click()

    })

  })