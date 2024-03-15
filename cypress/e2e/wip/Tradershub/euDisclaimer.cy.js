import "@testing-library/cypress/add-commands"

describe("QATEST-42150 Validate the EU statutory disclaimer in footer for EU users", () => {
    it("Should validate the EU statutory disclaimer in footer for EU users", () => {
      const loginEmail = Cypress.env('loginEUEmail')
      cy.c_login('',loginEmail)
      cy.c_visitResponsive("/appstore/traders-hub", "large")
      cy.c_validateEUDisclaimer()
      cy.c_visitResponsive("/appstore/traders-hub", "small")
      cy.c_validateEUDisclaimer()
    })
  })

describe("QATEST-37723 Validate the EU statutory disclaimer in footer of EU account for DIEL users ", () => {
    
    beforeEach(() => {
        Cypress.env('oAuthUrl', '<empty>') // Reset oAuthUrl before each test
    })
    
    it("Should validate the EU statutory disclaimer in footer of EU account for DIEL users", () => {
      const loginEmail = Cypress.env('loginDielEmail')
      cy.c_login('',loginEmail)
      cy.c_visitResponsive("/appstore/traders-hub", "large")
      cy.findByText("EU", { exact: true }).click()
      cy.c_closeNotificationHeader()
      cy.c_validateEUDisclaimer()
      cy.c_visitResponsive("/appstore/traders-hub", "small")
      cy.findByText("EU", { exact: true }).click()
      cy.c_validateEUDisclaimer()
    })
  })
  