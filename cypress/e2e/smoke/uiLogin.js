import "@testing-library/cypress/add-commands"

const username = Cypress.env("loginEmailProd")
const password = Cypress.env("loginPasswordProd")

describe("Verify deriv app login", () => {
  it("I should be able to successfully login to deriv app", () => {
    cy.c_visitResponsive("/", "large")
    cy.findByRole("button", { name: "Log in" }).click()
    cy.findByLabelText("Email").type(username)
    cy.findByLabelText("Password").type(password, { log: false })
    cy.findByRole("button", { name: "Log in" }).click()
    //Verify home page has successfully loaded
    cy.findByTestId("dt_div_100_vh")
      .findByTestId("dt_popover_wrapper")
      .findByTestId("dt_balance_text_container")
      .should("be.visible", {
        timeout: 30000,
      })
  })
})
