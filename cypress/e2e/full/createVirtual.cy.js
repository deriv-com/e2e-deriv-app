import "@testing-library/cypress/add-commands"

describe("TBC - Create virtual account", () => {
  let verification_code = Cypress.env("newSignupCode")

  it("should be able to create virtual account for indonesia client", () => {
    // const baseUrl = Cypress.config("baseUrl")

    cy.visit("https://deriv.com/signup").then(() => {
      // Set an item in localStorage using cy.window()
      cy.window().then((win) => {
        win.localStorage.setItem("config.server_url", Cypress.env('configServer'))
        win.localStorage.setItem("config.app_id", Cypress.env('configAppId'))
      })
    })
    cy.reload()
    cy.wait(2000)
    cy.findByPlaceholderText("Email").click().type("sample4@email.com")
    cy.findByLabelText("I agree to the terms and conditions").check()
    cy.findByRole("button", { name: "Create demo account" }).click()
    
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })

    cy.c_emailNewAccount(verification_code, Cypress.env("mainQaBoxBaseUrl"))
    cy.then(() => {

      const tempCode = Cypress.env("newSignupCode")
      cy.log('tempCode', tempCode)
    
    cy.c_visitResponsive(
      `https://app.deriv.com/`,
      "large"
    ).then(() => {
      cy.window().then((win) => {
        win.localStorage.setItem("config.server_url", Cypress.env('configServer'))
        win.localStorage.setItem("config.app_id", Cypress.env('configAppId'))
      })
    })
    cy.reload()
    cy.wait(1000)

    cy.c_visitResponsive(
      `https://app.deriv.com/redirect?action=signup&lang=EN&code=${tempCode}&date_first_contact=2022-12-15&signup_device=desktop`,
      "large"
    )
  
    cy.findByLabelText('Country of residence').click()
    cy.findByLabelText('Country of residence').click().type('indonesia')
    cy.findByText('Indonesia').click()
    cy.findByLabelText('Citizenship').click().type('indonesia')
    cy.findByText('Indonesia').click()
    cy.findByRole('button', { name: 'Next' }).click()
    cy.findByLabelText('Create a password').click().type('Abcd1234')
    cy.findByRole('button', { name: 'Start trading' }).click()
    cy.wait(2000)
    
    cy.get('[data-testid="1_1_questionnaire"]').then(($element1) => { // click if the page has A/B testing questionnaire
      if ($element1.length > 0) {
        cy.log('A/B testing questionnaire is found')
        cy.get('[data-testid="1_1_questionnaire"]').click()
      } else {
        cy.log('Neither text is found on the page.')
      }
    })

    // cy.wait(10000)
    
    })
  })

})
