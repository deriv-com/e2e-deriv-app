import "@testing-library/cypress/add-commands"
import {generateEpoch} from '../../../support/tradersHub'

function createSiblingacct(i){
    cy.findByTestId('dt_currency-switcher__arrow').click()
    cy.findByRole('button', { name: 'Add or manage account' }).click()
    cy.get('.currency-list__item').eq(i).click()
    cy.findByRole('button', { name: 'Add account' }).click()
    cy.findByRole('heading', { name: 'Success!' }).should('be.visible')
    cy.findByRole('button', { name: 'Deposit now' }).should('be.enabled')
    cy.findByRole('button', { name: 'Maybe later' }).click()  
}
function getCurrencyList() {
  return cy.get('div.currency-list__items').find('label').then(($labels) => { 
  const labelCount = $labels.length
  return labelCount
  })
}
describe("QATEST-5797, QATEST-5820 - Add siblings accounts", () => {
    const epoch = generateEpoch()
    const sign_up_mail = `sanity${epoch}@deriv.com`
    let country = Cypress.env("countries").CO
    let nationalIDNum = Cypress.env("nationalIDNum").CO
    let taxIDNum = Cypress.env("taxIDNum").CO
    let currency = Cypress.env("accountCurrency").USD
    beforeEach(() => {
      localStorage.setItem("config.server_url", Cypress.env("stdConfigServer"))
      localStorage.setItem("config.app_id", Cypress.env("stdConfigAppId"))
      cy.c_visitResponsive("/endpoint", "desktop")
      cy.findByRole("button", { name: "Sign up" }).should("not.be.disabled")
      cy.c_enterValidEmail(sign_up_mail)
    })

it("Create siblings accounts from USD account ", () =>{
  cy.c_demoAccountSignup(epoch, country) 
  cy.c_switchToReal()
  cy.findByRole('button', { name: 'Next' }).click()
  cy.findByRole('button', { name: 'OK' }).click()
  cy.findByRole("button", { name: "Get a Deriv account" }).click({ force: true }) 
  cy.c_generateRandomName().then((firstName) => {
    cy.c_personalDetails(
      firstName,
      "Onfido",
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
  cy.c_closeNotificationHeader()
  cy.findByTestId('dt_currency-switcher__arrow').click()
  cy.findByRole('button', { name: 'Add or manage account' }).click()
  getCurrencyList().then((labelCount) => {
  cy.get('.dc-modal-header__close').click()
    for (let i = 0; i < labelCount; i++) {
    createSiblingacct(i)
    }
  })
  })
})
