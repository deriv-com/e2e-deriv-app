import "@testing-library/cypress/add-commands"


describe("QATEST-37723 Validate the EU statutory disclaimer in footer of EU account for DIEL users ", () => {
  it("Should validate the EU statutory disclaimer in footer of EU account for DIEL users", () => {
    cy.c_login()
    cy.c_visitResponsive("/appstore/traders-hub", "large")
    cy.findByText("EU", { exact: true }).click()
    cy.c_closeNotificationHeader()
    cy.c_validateEUDisclaimer()
    cy.c_visitResponsive("/appstore/traders-hub", "small")
    cy.findByText("EU", { exact: true }).click()
    cy.c_validateEUDisclaimer()
  })
})
