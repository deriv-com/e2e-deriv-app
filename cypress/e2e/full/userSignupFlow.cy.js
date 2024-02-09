import '@testing-library/cypress/add-commands'

function enterValidEmail(sign_up_mail)
{
  cy.visit('https://deriv.com/signup/')
      cy.then(() => {
          cy.window().then((win) => {
            win.localStorage.setItem("config.server_url", Cypress.env('configServer'))
            win.localStorage.setItem("config.app_id", Cypress.env('configAppId'))
            const serverUrl = win.localStorage.getItem("config.server_url");
            const appId = win.localStorage.getItem("config.app_id");
            cy.log("Value of config.server_url in localStorage: " + serverUrl);
            cy.log("env value of server" + Cypress.env('configServer'))
            cy.log("Value of config.app_id in localStorage: " + appId);
          })
        })
//   cy.findByPlaceholderText('Email').should('be.visible').type(sign_up_mail)
//   cy.findByRole('checkbox').click()
//   cy.get('.error').should('not.exist')
//  // cy.findByRole('button', { name: 'Create demo account' }).should('not.be.disbaled')
//   cy.findByRole('button', { name: 'Create demo account' }).click()
//   cy.findByRole('heading', { name: 'Check your email' }).should('be.visible')
}

function generate_epoch(){
    return Math.floor(new Date().getTime() / 100000)
}

describe('Cypress test for full sign up flow', () => {

    const epoch = generate_epoch()
    const sign_up_mail =  'indu' + `${epoch}` + '@binary.com'
    let verification_code

    beforeEach(() => {
      localStorage.setItem("config.server_url", Cypress.env("configServer"))
      localStorage.setItem("config.app_id", Cypress.env("configAppId"))
      cy.c_visitResponsive('/endpoint',"desktop")
      cy.findByRole('button', { name: 'Sign up' }).should('not.be.disabled')
     // cy.findByRole('button', { name: 'Sign up' }).click()
      enterValidEmail(sign_up_mail)
    })

    function selectCountryOfResidence(){
      cy.findByLabelText('Country of residence').should('be.visible')
      cy.findByLabelText('Country of residence').clear().type(Cypress.env("country_of_residence"))
      cy.findByText(Cypress.env("country_of_residence")).click()
    }

    function selectCitizenship(){
      cy.findByLabelText('Citizenship').type(Cypress.env("citizenship")) 
      cy.findByText(Cypress.env("citizenship")).click()
      cy.findByRole('button', { name: 'Next' }).click()
    }

    function enterPassword(){
      cy.findByLabelText('Create a password').should('be.visible')
      cy.findByLabelText('Create a password').type(Cypress.env("user_password"))
      cy.findByRole('button', { name: 'Start trading' }).click()
    }

    function tradingPreference(){
      cy.get('.dc-btn.dc-btn--transparent').then(($element) => {
        if ($element.is(':visible')) {
            cy.get('.dc-btn.dc-btn--transparent').eq(1).click()
        } 
      })
    }

    function completeOnboarding(){
      for (let next_button_count = 0; next_button_count < 5; next_button_count++) {
        cy.contains('button', 'Next').should('be.visible')
        cy.contains('button', 'Next').click()
      }
      cy.contains('Start trading').should('be.visible')
      cy.contains('button', 'Start trading').click()   
      cy.contains('Switch accounts').should('be.visible')
      cy.contains('button', 'Next').click()
      if(Cypress.env("diel_country_list").includes(Cypress.env("citizenship")) ){
        cy.contains('Choice of regulation').should('be.visible')
        cy.contains('button', 'Next').click()
      }
      cy.contains("Trader's Hub tour").should('be.visible')
      cy.contains('button', 'OK').click()
    }


    it('enter mail id to signup on deriv.com', () => {
      cy.wait(5000) //TODO - To be replaced by a loop within the emailVerification below.
      cy.c_emailVerificationSignUp(verification_code,Cypress.env("event_email_url"), epoch)
      cy.then(() => {
        cy.c_visitResponsive(
          Cypress.env("derivAppUrl") + '/endpoint',
          "desktop"
        ).then(() => {
          cy.window().then((win) => {
            win.localStorage.setItem("config.server_url", Cypress.env('configServer'))
            win.localStorage.setItem("config.app_id", Cypress.env('configAppId'))
          })
        })

        verification_code = Cypress.env("emailVerificationCode")
        const today = new Date()
        const signupUrl = `${Cypress.env("derivAppUrl")}/redirect?action=signup&lang=EN_US&code=${verification_code}&date_first_contact=${today.toISOString().split('T')[0]}&signup_device=desktop`

        cy.c_visitResponsive(signupUrl, "desktop")
   
        cy.get('h1').contains('Select your country and').should('be.visible')

        selectCountryOfResidence()
        selectCitizenship()
        enterPassword()
        completeOnboarding()

      })
    })

})

