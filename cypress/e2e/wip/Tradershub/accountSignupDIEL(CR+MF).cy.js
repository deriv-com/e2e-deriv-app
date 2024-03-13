import "@testing-library/cypress/add-commands"
import {generateEpoch} from '../../../support/tradersHub'

const regulationText = ".regulators-switcher__switch div.item.is-selected"


describe("QATEST-5554: Verify DIEL Signup flow - CR + MF", () => {
  const epoch = generateEpoch()
  const signUpMail = `sanity${epoch}diel@deriv.com`
  let country = Cypress.env("countries").ZA
  let nationalIDNum = Cypress.env("nationalIDNum").ZA
  let taxIDNum = Cypress.env("taxIDNum").ZA

  beforeEach(() => {
    localStorage.setItem("config.server_url", Cypress.env("stdConfigServer"))
    localStorage.setItem("config.app_id", Cypress.env("stdConfigAppId"))
    cy.c_visitResponsive("/endpoint", "desktop")
    cy.findByRole("button", { name: "Sign up" }).should("not.be.disabled")
    cy.c_enterValidEmail(signUpMail)
  })
  it("Verify I can signup for a DIEL demo and real account", () => {
    Cypress.env("citizenship", country)
    cy.c_demoAccountSignup(epoch, country)
    cy.c_checkTradersHubHomePage()
    cy.findByTestId("dt_dropdown_display").click()
    cy.get("#real").click()
    cy.get(regulationText).should("have.text", "Non-EU")
    cy.findByRole("button", { name: "Get a Deriv account" }).click()
    cy.c_generateRandomName().then((firstName) => {
      cy.c_personalDetails(firstName, "IDV", country, nationalIDNum, taxIDNum)
    })
    cy.contains(
      "Only use an address for which you have proof of residence"
    ).should("be.visible")
    cy.c_addressDetails()
    cy.c_completeFatcaDeclarationAgreement()
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
    cy.c_manageAccountsetting(country)
  })
})
