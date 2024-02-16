import '@testing-library/cypress/add-commands'

function generate_epoch(){
    return Math.floor(new Date().getTime() / 100000)
}
function createDemoAccount(CoR,Cit,epoch) {
  let verification_code
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
  cy.c_selectCountryOfResidence(CoR)
  cy.c_selectCitizenship(Cit) 
  cy.c_enterPassword()
  cy.c_completeOnboarding()
  cy.c_checkTradersHubhomePage()
  })
}
function addRealAccount(identity,taxResi){
  cy.findByTestId('dt_dropdown_display').click()
  cy.get('#real').click()
  cy.findByRole('button', { name: 'Get a Deriv account' }).click()
  cy.c_generateRandomName().then(firstName => {
    cy.log('pppfirstName: ' + firstName)
    cy.log('lllidentity: ' + identity)
    cy.log('tqqqaxResi: ' + taxResi)
    cy.c_personalDetails(firstName,identity,taxResi)})
    if (identity == 'Onfido' ){
      cy.contains('Only use an address for which you have proof of residence').should('be.visible')
    }
  cy.c_addressDetails()
  cy.c_addAccount()
  cy.c_manageAccountsetting(taxResi)

}

describe('Cypress test for ROW account sign up', () => {
  let epoch
  let counter = 0
    beforeEach(() => {
      localStorage.setItem("config.server_url", Cypress.env("stdConfigServer"))
      localStorage.setItem("config.app_id", Cypress.env("stdConfigAppId"))
      cy.c_visitResponsive('/endpoint',"desktop")
      cy.findByRole('button', { name: 'Sign up' }).should('not.be.disabled')
      //cy.findByRole('button', { name: 'Sign up' }).click()
      counter++
      epoch = generate_epoch() + counter
      cy.log('time is  =' + epoch)
      const sign_up_mail =  'sanity' + `${epoch}` + '@binary.com'
      cy.c_enterValidEmail(sign_up_mail)
    })
    it('New account sign up ROW - Onfido supported country', () => {
      cy.log('xxxxxxtime is onfido  =' + epoch)
      createDemoAccount(Cypress.env("CoROnfidoROW"),Cypress.env("citizenshipOnfidoROW"),epoch)
      addRealAccount('Onfido', Cypress.env("CoROnfidoROW"))
    })
    it('New account sign up ROW - IDV supported country', () => {
      cy.log('yyyyytime is IDv  =' + epoch)
      createDemoAccount(Cypress.env("CoRIDVROW"),Cypress.env("citizenshipIDVROW"),epoch)
      addRealAccount('IDV', Cypress.env("CoRIDVROW"))
    }) 
})