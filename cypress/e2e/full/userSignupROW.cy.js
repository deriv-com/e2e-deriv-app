import '@testing-library/cypress/add-commands'

function generate_epoch(){
    return Math.floor(new Date().getTime() / 100000)
}

describe('Cypress test for ROW account sign up', () => {
    const epoch = generate_epoch()
    const sign_up_mail =  'sanity' + `${epoch}` + '@binary.com'
    let verification_code

    beforeEach(() => {
      localStorage.setItem("config.server_url", Cypress.env("stdConfigServer"))
      localStorage.setItem("config.app_id", Cypress.env("stdConfigAppId"))
      cy.c_visitResponsive('/endpoint',"desktop")
      cy.findByRole('button', { name: 'Sign up' }).should('not.be.disabled')
      //cy.findByRole('button', { name: 'Sign up' }).click()
      cy.c_enterValidEmail(sign_up_mail)
    })
    it('New account sign up ROW - Onfido supported country', () => {
      cy.wait(5000) //TODO - To be replaced by a loop within the emailVerification below.
      cy.c_emailVerificationSignUp(verification_code,Cypress.env("event_email_url"), epoch)
      cy.then(() => {
      cy.c_visitResponsive('/endpoint',"desktop").then(() => {
          cy.window().then((win) => {
          win.localStorage.setItem("config.server_url", Cypress.env('stdConfigServer'))
          win.localStorage.setItem("config.app_id", Cypress.env('stdConfigAppId'))
          })
        })

      verification_code = Cypress.env("emailVerificationCode")
      const today = new Date()
      const signupUrl = `${Cypress.config("baseUrl")}/redirect?action=signup&lang=EN_US&code=${verification_code}&date_first_contact=${today.toISOString().split('T')[0]}&signup_device=desktop`
      cy.c_visitResponsive(signupUrl, "desktop")
      cy.get('h1').contains('Select your country and').should('be.visible')
      cy.c_selectCountryOfResidence(Cypress.env("CoROnfidoROW"))
      cy.c_selectCitizenship(Cypress.env("citizenshipOnfidoROW")) 
      cy.c_enterPassword()
      cy.c_completeOnboarding()
      })
      cy.c_checkTradersHubhomePage()

      //This flow will create rel account
      cy.findByTestId('dt_dropdown_display').click()
      cy.get('#real').click()
      cy.findByRole('button', { name: 'Get a Deriv account' }).click()
      cy.c_generateRandomName().then(firstName => {
      cy.c_personalDetails(firstName,'Onfido',Cypress.env("CoROnfidoROW"))})
      cy.c_addressDetails()
      cy.c_addAccount()
      cy.c_manageAccountsetting(Cypress.env("CoROnfidoROW"))
      
    })
    it('New account sign up ROW - IDV supported country', () => {
      cy.wait(5000) //TODO - To be replaced by a loop within the emailVerification below.
      cy.c_emailVerificationSignUp(verification_code,Cypress.env("event_email_url"), epoch)
      cy.then(() => {
      cy.c_visitResponsive('/endpoint',"desktop").then(() => {
          cy.window().then((win) => {
          win.localStorage.setItem("config.server_url", Cypress.env('stdConfigServer'))
          win.localStorage.setItem("config.app_id", Cypress.env('stdConfigAppId'))
          })
        })
      verification_code = Cypress.env("emailVerificationCode")
      const today = new Date()
      const signupUrl = `${Cypress.config("baseUrl")}/redirect?action=signup&lang=EN_US&code=${verification_code}&date_first_contact=${today.toISOString().split('T')[0]}&signup_device=desktop`
      cy.c_visitResponsive(signupUrl, "desktop")
      cy.get('h1').contains('Select your country and').should('be.visible')
      cy.c_selectCountryOfResidence(Cypress.env("CoRIDVROW"))
      cy.c_selectCitizenship(Cypress.env("citizenshipIDVROW")) 
      cy.c_enterPassword()
      cy.c_completeOnboarding()
      })
      cy.c_checkTradersHubhomePage()
      cy.findByTestId('dt_dropdown_display').click()
      cy.get('#real').click()
      cy.findByRole('button', { name: 'Get a Deriv account' }).click()
      cy.c_generateRandomName().then(firstName => {
      cy.c_personalDetails(firstName,'IDV',Cypress.env("CoRIDVROW"))})
      cy.c_addressDetails()
      cy.c_addAccount()
      cy.c_manageAccountsetting(Cypress.env("CoRIDVROW"))
    }) 
})

