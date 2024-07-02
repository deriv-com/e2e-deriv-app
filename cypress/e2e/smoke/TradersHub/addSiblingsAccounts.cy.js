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
describe('QATEST-5797, QATEST-5820: Add siblings accounts', () => {
  const size = ['small', 'desktop']
  let country = Cypress.env('countries').CO
  let countryCode = 'co'
  let currencyCode = 'USD'
  let currency = Cypress.env('accountCurrency').USD
  let nationalIDNum = Cypress.env('nationalIDNum').CO
  let taxIDNum = Cypress.env('taxIDNum').CO
  beforeEach(() => {
    cy.c_createDemoAccount({ country_code: countryCode })
    cy.c_login()
  })
  size.forEach((size) => {
    it(`Should Create siblings accounts from USD account on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('/', size)
      //Wait for page to completely load
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
      if (isMobile) cy.c_skipPasskeysV2()
      cy.c_switchToReal()
      cy.findByText('Add a Deriv account').should('be.visible')
      cy.c_generateRandomName().then((firstName) => {
        cy.c_personalDetails(
          firstName,
          'Onfido',
          country,
          nationalIDNum,
          taxIDNum,
          currency,
          { isMobile: isMobile }
        )
      })
      cy.c_addressDetails()
      cy.c_completeFatcaDeclarationAgreement()
      cy.c_addAccount()
      cy.c_checkTradersHubHomePage(isMobile)
      cy.c_closeNotificationHeader()
      cy.findByTestId('dt_currency-switcher__arrow').click()
      cy.findByRole('button', { name: 'Add or manage account' }).click()
      getCurrencyList().then((labelCount) => {
        if (isMobile) cy.findByTestId('dt_dc_mobile_dialog_close_btn').click()
        else cy.findByTestId('dt_modal_close_icon').click()
        for (let acctCount = 0; acctCount < labelCount; acctCount++) {
          createSiblingAcct(acctCount)
        }
      })
    })
  })
})
