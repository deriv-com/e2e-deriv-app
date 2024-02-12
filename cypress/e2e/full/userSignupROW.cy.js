import '@testing-library/cypress/add-commands'

function generate_epoch(){
    return Math.floor(new Date().getTime() / 100000)
}

describe('Cypress test for ROW account sign up', () => {
    const epoch = generate_epoch()
    const sign_up_mail =  'sanity' + `${epoch}` + '@binary.com'
    let verification_code

    beforeEach(() => {
      localStorage.setItem("config.server_url", Cypress.env("configServer"))
      localStorage.setItem("config.app_id", Cypress.env("configAppId"))
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
          win.localStorage.setItem("config.server_url", Cypress.env('configServer'))
          win.localStorage.setItem("config.app_id", Cypress.env('configAppId'))
          })
        })

      verification_code = Cypress.env("emailVerificationCode")
      const today = new Date()
      const signupUrl = `${Cypress.config("baseUrl")}/redirect?action=signup&lang=EN_US&code=${verification_code}&date_first_contact=${today.toISOString().split('T')[0]}&signup_device=desktop`
      cy.log("signupurl is :" + signupUrl)
      cy.c_visitResponsive(signupUrl, "desktop")
      cy.get('h1').contains('Select your country and').should('be.visible')
      cy.c_selectCountryOfResidence()
      cy.c_selectCitizenship()
      cy.c_enterPassword()
      cy.c_completeOnboarding()
      })
      cy.c_checkTradersHubhomePage()

      //This flow will create rel account
      cy.findByTestId('dt_dropdown_display').click()
      cy.get('#real').click()
      cy.findByRole('button', { name: 'Get a Deriv account' }).click()
      cy.c_generateRandomName().then(firstName => {
      cy.c_personalDetails(firstName)})
      cy.findByRole('button', { name: 'Previous' }).click();
      cy.findByRole('button', { name: 'Next' }).click();
      cy.findByRole('button', { name: 'Next' }).click();
      cy.c_addressDetails()
      cy.c_addAccount()
      cy.close_notification_banner()
      cy.c_manageAccountsetting()
      cy.findByRole('link', { name: 'Proof of identity' }).click();
      cy.findByText('In which country was your document issued?').should('be.visible')
      cy.findByRole('button',{name:'Next'}).should('be.disabled')
      cy.findByLabelText('Country').type(Cypress.env("country_of_residence"))
      cy.findByText(Cypress.env("country_of_residence")).click()
      cy.findByRole('button',{name:'Next'}).should('not.be.disabled')
      
    })
 
})

