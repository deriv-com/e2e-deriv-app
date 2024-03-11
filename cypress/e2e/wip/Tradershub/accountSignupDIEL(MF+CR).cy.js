import "@testing-library/cypress/add-commands"
import {generateEpoch} from '../../../support/tradersHub'

const regulationText = ".regulators-switcher__switch div.item.is-selected"

describe("QATEST-6211: Verify DIEL Signup flow - MF + CR", () => {
  const epoch = generateEpoch()
  const sign_up_mail = `sanity${epoch}dielmfcr@deriv.com`
  let country = Cypress.env("countries").ZA
  let nationalIDNum = Cypress.env("nationalIDNum").ZA
  let taxIDNum = Cypress.env("taxIDNum").ZA
  let euCurrency = Cypress.env("accountCurrency").GBP

  beforeEach(() => {
    localStorage.setItem("config.server_url", Cypress.env("stdConfigServer"))
    localStorage.setItem("config.app_id", Cypress.env("stdConfigAppId"))
    cy.c_visitResponsive("/endpoint", "desktop")
    cy.findByRole("button", { name: "Sign up" }).should("not.be.disabled")
    cy.c_enterValidEmail(sign_up_mail)
  })
  it("Verify I can signup for a DIEL demo and real account", () => {
    Cypress.env("citizenship", Cypress.env("dielCountry"))
    cy.c_demoAccountSignup(epoch, country)
    cy.c_checkTradersHubhomePage()
    cy.findByTestId("dt_dropdown_display").click()
    cy.get("#real").click()
    cy.findByText("EU", { exact: true }).click()
    cy.get(regulationText).should("have.text", "EU")
    cy.findByRole("button", { name: "Get a Deriv account" }).click()
    cy.c_generateRandomName().then((firstName) => {
      cy.c_personalDetails(
        firstName,
        "MF",
        country,
        nationalIDNum,
        taxIDNum,
        euCurrency
      )
    })
    cy.c_addressDetails()
    cy.c_completeTradingAssessment()
    cy.c_completeFinancialAssessment()
    cy.c_completeFatcaDeclarationAgreement()
    cy.c_addAccountMF()
    cy.findByText("Non-EU", { exact: true }).click()
    cy.get(regulationText).should("have.text", "Non-EU")
    cy.findByRole("button", { name: "Get a Deriv account" }).click()
    cy.findByText("US Dollar").click()
    cy.findByRole("button", { name: "Next" }).click()
    cy.findByLabelText("Choose the document type").click()
    cy.findByText("National ID Number").click()
    cy.findByLabelText("Enter your document number").type(nationalIDNum)
    cy.get(".dc-checkbox__box").as("checkbox").click({ multiple: true })
    cy.findByRole("button", { name: "Next" }).click()
    cy.findByRole("button", { name: "Next" }).click()
    cy.c_addAccount()
    cy.c_manageAccountsetting(country)
  })
})
