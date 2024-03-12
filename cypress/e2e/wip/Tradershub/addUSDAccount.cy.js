import '@testing-library/cypress/add-commands'

function generate_epoch() {
  return Math.floor(new Date().getTime() / 100000)
}

describe('QATEST 5813 - Add USD account for existing BTC account', () => {
  const epoch = generate_epoch()
  const sign_up_mail = `sanity${epoch}crypto@deriv.com`
  let country = Cypress.env('countries').CO
  let nationalIDNum = Cypress.env('nationalIDNum').CO
  let taxIDNum = Cypress.env('taxIDNum').CO
  let currency = Cypress.env('accountCurrency').BTC

  beforeEach(() => {
    localStorage.setItem('config.server_url', Cypress.env('stdConfigServer'))
    localStorage.setItem('config.app_id', Cypress.env('stdConfigAppId'))
    cy.c_visitResponsive('/endpoint', 'desktop')
    cy.findByRole('button', { name: 'Sign up' }).should('not.be.disabled')
    cy.c_enterValidEmail(sign_up_mail)
  })
  it('Create a new crypto account and add USD account', () => {
    cy.c_emailVerification(Cypress.env("qaBoxBaseUrl"),"account_opening_new.html","sanity" + `${epoch}` + "@binary.com") 
    cy.then(() => {
      cy.c_visitResponsive(Cypress.env('verificationdUrl'), 'desktop').then(() => {
        cy.window().then((win) => {
          win.localStorage.setItem(
            'config.server_url',
            Cypress.env('stdConfigServer')
          )
          win.localStorage.setItem(
            'config.app_id',
            Cypress.env('stdConfigAppId')
          )
        })
      })

      cy.get('h1').contains('Select your country and').should('be.visible')
      cy.c_selectCountryOfResidence(country)
      cy.c_selectCitizenship(country)
      cy.c_enterPassword()
    })
    cy.c_completeOnboarding()
    cy.findByTestId('dt_dropdown_display').click()
    cy.get('#real').click()
    cy.findByRole('button', { name: 'Get a Deriv account' }).click()
    cy.c_generateRandomName().then((firstName) => {
      cy.c_personalDetails(
        firstName,
        'Onfido',
        country,
        nationalIDNum,
        taxIDNum,
        currency
      )
    })
    cy.c_addressDetails()
    cy.c_addAccount()
    cy.c_checkTradersHubhomePage()
    cy.c_closeNotificationHeader()
    cy.findByTestId('dt_currency-switcher__arrow').click()
    cy.findByRole('button', { name: 'Add or manage account' }).click()
    cy.findByText('Fiat currencies').click()
    cy.findByText('US Dollar').click()
    cy.findByRole('button', { name: 'Add account' }).click()
    cy.findByRole('heading', { name: 'Success!' }).should('be.visible', {
      timeout: 30000,
    })
    cy.findByText('You have added a USD account.').should('be.visible')
    cy.findByRole('button', { name: 'Maybe later' }).click()
  })
})
