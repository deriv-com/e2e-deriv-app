import '@testing-library/cypress/add-commands'
import { generateAccountNumberString } from '../../../support/helper/utility'

let nickname = `NickWithAcc${generateAccountNumberString(5)}`

describe('QATEST-2292 - Register a new client as an Advertiser in Deriv P2P - Nickname checks', () => {
  const signUpEmail = `sanity${generateAccountNumberString()}p2p@deriv.com`
  let country = Cypress.env('countries').CO
  let nationalIDNum = Cypress.env('nationalIDNum').CO
  let taxIDNum = Cypress.env('taxIDNum').CO
  let currency = Cypress.env('accountCurrency').USD

  beforeEach(() => {
    cy.log(country + ' ' + nationalIDNum + ' ' + taxIDNum + ' ' + currency)
    cy.c_setEndpoint(signUpEmail)
    cy.c_visitResponsive('/cashier/p2p', 'small')
  })

  it('Should be able to set a nickname for P2P in responsive mode.', () => {
    cy.c_demoAccountSignup(country, signUpEmail)
    cy.c_switchToReal()
    cy.c_completeTradersHubTour()
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
    cy.c_completeFatcaDeclarationAgreement()
    cy.c_addAccount()
    cy.c_checkTradersHubHomePage()
    cy.c_closeSafetyInstructions()
    cy.findByText('Deriv P2P').should('exist')
    cy.c_closeNotificationHeader()
    cy.findByText('My profile').click()
    cy.findByRole('heading', { name: 'What’s your nickname?' }).should(
      'be.visible'
    )
    cy.findByText(
      'Others will see this on your profile, ads, and chats.'
    ).should('be.visible')
    cy.findByText('Your nickname cannot be changed later.').should('be.visible')
    cy.findByRole('textbox', { name: 'Your nickname' })
      .type(nickname)
      .should('have.value', nickname)
      .and('have.length.below', 25)
    cy.findByRole('button', { name: 'Confirm' }).should('be.enabled').click()
    cy.findByText(nickname).should('be.visible')
  })
})
