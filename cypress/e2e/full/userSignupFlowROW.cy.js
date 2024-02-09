import '@testing-library/cypress/add-commands'

function enterValidEmail(sign_up_mail)
{
  cy.visit('https://deriv.com/signup/', {
    onBeforeLoad(win) {
      win.localStorage.setItem("config.server_url", Cypress.env('configServer'));
      win.localStorage.setItem("config.app_id", Cypress.env('configAppId'));
    }
  })    
  cy.findByPlaceholderText('Email').should('be.visible').type(sign_up_mail)
  cy.findByRole('checkbox').click()
  cy.get('.error').should('not.exist')
  //cy.findByRole('button', { name: 'Create demo account' }).should('not.be.disbaled')
  cy.findByRole('button', { name: 'Create demo account' }).click()
  cy.findByRole('heading', { name: 'Check your email' }).should('be.visible')
}

function generate_epoch(){
    return Math.floor(new Date().getTime() / 100000)
}

describe('Cypress test for full sign up flow', () => {

    const epoch = generate_epoch()
    const sign_up_mail =  'sanity' + `${epoch}` + '@binary.com'
    let verification_code

    beforeEach(() => {
      localStorage.setItem("config.server_url", Cypress.env("configServer"))
      localStorage.setItem("config.app_id", Cypress.env("configAppId"))
      cy.c_visitResponsive('/endpoint',"desktop")
      cy.findByRole('button', { name: 'Sign up' }).should('not.be.disabled')
      //cy.findByRole('button', { name: 'Sign up' }).click()
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

    it('new account sign up - ROW', () => {
      cy.wait(5000) //TODO - To be replaced by a loop within the emailVerification below.
      cy.c_emailVerificationSignUp(verification_code,Cypress.env("event_email_url"), epoch)
      cy.then(() => {
        cy.log("1st then check")
        cy.c_visitResponsive('/endpoint',"desktop"
        ).then(() => {
          cy.window().then((win) => {
            win.localStorage.setItem("config.server_url", Cypress.env('configServer'))
            win.localStorage.setItem("config.app_id", Cypress.env('configAppId'))
            cy.log("seccnd responsive check passed")
          })
        })

        verification_code = Cypress.env("emailVerificationCode")
        const today = new Date()
        const signupUrl = `${Cypress.config("baseUrl")}/redirect?action=signup&lang=EN_US&code=${verification_code}&date_first_contact=${today.toISOString().split('T')[0]}&signup_device=desktop`
        cy.log("signupurl is :" + signupUrl)

        cy.c_visitResponsive(signupUrl, "desktop")
   
        cy.get('h1').contains('Select your country and').should('be.visible')

        selectCountryOfResidence()
        selectCitizenship()
        enterPassword()
        completeOnboarding()
      })
       cy.c_checkTradersHubhomePage()
      //This flow will create rel accountCreate release account
        cy.findByTestId('dt_dropdown_display').click()
        cy.get('#real').click()
        cy.findByRole('button', { name: 'Get a Deriv account' }).click()
        cy.findByText('US Dollar').click()
        cy.findByRole('button', { name: 'Next' }).click()
        cy.contains('Any information you provide is confidential').should('be.visible')
        cy.findByTestId('first_name').type('Cypress')
        cy.findByTestId('last_name').type('testaccount')
        cy.findByTestId('date_of_birth').click()
        cy.findByText('2006').click()
        cy.findByText('Feb').click()
        cy.findByText('9', { exact: true }).click()
        cy.findByTestId('phone').type('12345678')
        cy.findByTestId('place_of_birth').type('colo')
        cy.findByText('Colombia').click()
        cy.findByTestId('tax_residence').type('colo')
        cy.findByText('Colombia').click()
        cy.findByTestId('tax_identification_number').type('1234567890');
        cy.findByTestId('dt_personal_details_container').findByTestId('dt_dropdown_display').click();
        cy.get('#Hedging').click()
        cy.get('.dc-checkbox__box').click()
        cy.findByRole('button', { name: 'Previous' }).click();
        cy.findByRole('button', { name: 'Next' }).click();
        cy.findByRole('button', { name: 'Next' }).click();
        cy.contains('Only use an address for which you have proof of residence').should('be.visible')
        cy.findByLabelText('First line of address*').type('myaddress 1')
        cy.findByLabelText('Second line of address').type('myaddress 2')
        cy.findByLabelText('Town/City*').type('mycity')
        cy.findByLabelText('State/Province').click()
        cy.findByText('Amazonas').click()
        cy.findByLabelText('Postal/ZIP Code').type('1234')
        cy.findByRole('button', { name: 'Next' }).click();
        cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
        cy.get('.dc-checkbox__box').eq(0).click()
        cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
        cy.get('.dc-checkbox__box').eq(1).click()
        cy.findByRole('button', { name: 'Add account' }).click()
        cy.findByRole('heading', { name: 'Your account is ready' }).should('be.visible')
        cy.findByRole('button', { name: 'Maybe later' }).should('be.visible')
        cy.findByRole('button', { name: 'Deposit' }).should('be.visible')
        cy.findByRole('button', { name: 'Maybe later' }).click()





      //  cy.findByRole('label').filter({ hasText: 'US Dollar(USD)' }).findByRole('img').click()
      //  cy.fundByRole('button', { name: 'Next' }).click()
    })

})

