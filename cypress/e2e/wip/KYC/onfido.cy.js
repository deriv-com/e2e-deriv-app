import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/helper/utility'

function createDemoAccount(CoR, Cit, epoch) {
  cy.c_emailVerification(
    'account_opening_new.html',
    `sanity${epoch}@binary.com`
  )
  cy.then(() => {
    let verification_code = Cypress.env('walletsWithdrawalCode')
    cy.c_visitResponsive('/endpoint', 'desktop').then(() => {
      cy.window().then((win) => {
        win.localStorage.setItem(
          'config.server_url',
          Cypress.env('stdConfigServer')
        )
        win.localStorage.setItem('config.app_id', Cypress.env('stdConfigAppId'))
        cy.log('this is signUpUrl', Cypress.env('signUpUrl'))
        cy.c_visitResponsive(
          `/redirect?action=signup&lang=EN_GB&code=${verification_code}&date_first_contact=2024-04-01&signup_device=desktop`,
          'large'
        )
      })
    })

    //   -----
    //   cy.c_emailVerification(
    //     'request_payment_withdraw.html',
    //     Cypress.env('walletloginEmail')
    //   )
    //   cy.then(() => {
    //     let verification_code = Cypress.env('walletsWithdrawalCode')
    //     cy.c_visitResponsive(
    //       `/wallets/cashier/withdraw?verification=${verification_code}`,
    //       'large'
    //     )
    //   ------
    //   cy.c_visitResponsive(Cypress.env('signUpUrl'), 'desktop')
    cy.get('h1').contains('Select your country and').should('be.visible')
    cy.c_selectCountryOfResidence(CoR)
    cy.c_selectCitizenship(Cit)
    cy.c_enterPassword()
    cy.c_completeOnboarding()
    cy.c_checkTradersHubHomePage()
  })
}
function addRealAccount(identity, taxResi, nationalIDNum, taxIDNum) {
  cy.findByTestId('dt_dropdown_display').click()
  cy.get('#real').click()
  cy.get('.dc-btn').first().click()
  cy.get('.dc-modal-header__close').click()
  cy.findByRole('button', { name: 'Yes' }).click()
  cy.findByRole('button', { name: 'Get a Deriv account' }).click()
  cy.c_generateRandomName().then((firstName) => {
    cy.c_personalDetails(firstName, identity, taxResi, nationalIDNum, taxIDNum)
  })
  if (identity == 'Onfido') {
    cy.contains(
      'Only use an address for which you have proof of residence'
    ).should('be.visible')
  }
  cy.c_addressDetails()
  cy.c_addAccount()
  cy.c_manageAccountsetting(taxResi)
}
function addRealacctfromAcctswitcher() {
  cy.get('.traders-hub-header__setting').click()
  cy.findByTestId('dt_acc_info').click()
  cy.findByText('Real').click()
  cy.findByRole('button', { name: 'Add' }).click()
  cy.get('div')
    .filter(':contains("Add a Deriv account")')
    .find('[role="button"]')
    .click()
  cy.findByRole('button', { name: 'Yes' }).click()
  cy.findByText("Trader's Hub").click()
}

describe('QATEST-xx Test Onfido Document Upload', () => {
  let epoch
  let counter = 0
  let countryIDV = Cypress.env('countries').KE
  let nationalIDNumIDV = Cypress.env('nationalIDNum').KE
  let taxIDNumIDV = Cypress.env('taxIDNum').KE
  let countryOnfido = Cypress.env('countries').CO
  let nationalIDNumOnfido = Cypress.env('nationalIDNum').CO
  let taxIDNumOnfido = Cypress.env('taxIDNum').CO

  beforeEach(() => {
    localStorage.setItem('config.server_url', Cypress.env('stdConfigServer'))
    localStorage.setItem('config.app_id', Cypress.env('stdConfigAppId'))
    cy.c_visitResponsive('/endpoint', 'desktop')
    cy.findByRole('button', { name: 'Sign up' }).should('not.be.disabled')
    //cy.findByRole('button', { name: 'Sign up' }).click()
    counter++
    epoch = generateEpoch() + counter
    cy.log('time is  =' + epoch)
    const signUpMail = 'sanity' + `${epoch}` + '@binary.com'
    cy.c_enterValidEmail(signUpMail)
  })

  beforeEach(() => {
    // cy.c_login()
    // cy.c_navigateToPoiResponsive('Ghana')
  })

  it('should return onfido pass result', () => {
    createDemoAccount(countryOnfido, countryOnfido, epoch)
    addRealAccount('Onfido', countryOnfido, nationalIDNumOnfido, taxIDNumOnfido)
  })
})
