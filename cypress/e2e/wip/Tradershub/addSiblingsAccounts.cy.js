import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/helper/utility'

function createSiblingAcct(acctCount) {
  cy.findByTestId('dt_currency-switcher__arrow').click()
  cy.findByRole('button', { name: 'Add or manage account' }).click()
  cy.get('.currency-list__item').eq(acctCount).click()
  cy.findByRole('button', { name: 'Add account' }).click()
  cy.findByRole('heading', { name: 'Success!' }).should('be.visible')
  cy.findByRole('button', { name: 'Deposit now' }).should('be.enabled')
  cy.findByRole('button', { name: 'Maybe later' }).click()
}
function getCurrencyList() {
  return cy
    .get('div.currency-list__items')
    .find('label')
    .then(($labels) => {
      const labelCount = $labels.length
      return labelCount
    })
}
describe('QATEST-5797, QATEST-5820 - Add siblings accounts', () => {
  const epoch = generateEpoch()
  const signUpMail = `sanity${epoch}@deriv.com`
  let country = Cypress.env('countries').CO
  let nationalIDNum = Cypress.env('nationalIDNum').CO
  let taxIDNum = Cypress.env('taxIDNum').CO
  let currency = Cypress.env('accountCurrency').USD
  beforeEach(() => {
    cy.c_setEndpoint(signUpMail)
  })

  it('Create siblings accounts from USD account ', () => {
    cy.c_demoAccountSignup(country, signUpMail)
    cy.c_switchToReal()
    cy.findByRole('button', { name: 'Next' }).click()
    cy.findByRole('button', { name: 'OK' }).click()
    cy.findByRole('button', { name: 'Get a Deriv account' }).click({
      force: true,
    })
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
    cy.c_closeNotificationHeader()
    cy.findByTestId('dt_currency-switcher__arrow').click()
    cy.findByRole('button', { name: 'Add or manage account' }).click()
    getCurrencyList().then((labelCount) => {
      cy.findByTestId('dt_modal_close_icon').click()
      for (let acctCount = 0; acctCount < labelCount; acctCount++) {
        createSiblingAcct(acctCount)
      }
    })
  })
})
