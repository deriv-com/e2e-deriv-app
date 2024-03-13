import "@testing-library/cypress/add-commands"
import {generateEpoch} from '../../../support/tradersHub'

describe("QATEST-5695: Create a Derived Demo CFD account", () => {
  const epoch = generateEpoch()
  const sign_up_mail = `sanity${epoch}+mt5deriveddemo@deriv.com`
  let country = Cypress.env("countries").CO

  beforeEach(() => {
    localStorage.setItem("config.server_url", Cypress.env("stdConfigServer"))
    localStorage.setItem("config.app_id", Cypress.env("stdConfigAppId"))
    cy.c_visitResponsive("/endpoint", "desktop")
    cy.findByRole("button", { name: "Sign up" }).should("not.be.disabled")
    cy.c_enterValidEmail(sign_up_mail)
  })
  it("Verify I can signup for a demo derived CFD account", () => {
    cy.c_demoAccountSignup(epoch, country, sign_up_mail)
    cy.c_checkTradersHubHomePage()
    cy.findAllByRole("button", { name: "Get" }).first().click()
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
      "Success!Congratulations, you have successfully created your demo Deriv MT5 Derived account")
    cy.findByRole("button", { name: "Continue" }).click()
    cy.findByText("10,000.00 USD").should("be.visible")
    cy.findByRole("button", { name: "Top up" }).should("exist")
    cy.get("button:nth-child(2)").click()
    cy.get("#modal_root").findByText("Derived Demo").should("be.visible")
  })
})
