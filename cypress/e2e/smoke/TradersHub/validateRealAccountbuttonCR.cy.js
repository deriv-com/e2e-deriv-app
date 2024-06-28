function validateAccountSwticher(isMobile) {
  if (isMobile) {
    cy.findByTestId('dt_span').findByRole('link').click()
    cy.findByTestId('dt_acc_info').click()
    cy.get('#dt_core_account-switcher_demo-tab').should('be.visible')
  } else {
    cy.findByRole('banner').findByTestId('dt_span').findByRole('link').click()
    cy.findByTestId('dt_acc_info').click()
  }
  cy.findByTestId('dt_link').within(() => {
    cy.findByText("Looking for CFD accounts? Go to Trader's Hub").should(
      'be.visible'
    )
  })
  cy.findByText('Real').click()
  cy.findByText('Options & Multipliers').should('be.visible')
  cy.findByRole('button', { name: 'Add' }).should('be.visible')
  cy.findByTestId('acc-switcher').findByTestId('dt_span').should('be.visible')
  cy.findByText('Total assets', { exact: true }).should('be.visible')
  cy.findByTestId('acc-switcher').findByText('Log out').should('be.visible')
  cy.findByRole('button', { name: 'Add' }).click()
  cy.findByRole('heading', { name: 'Add a Deriv account' }).should('be.visible')
  cy.findByRole('button', { name: 'Next' }).should('be.disabled')
  cy.contains('label', 'US Dollar(USD)').click()
  cy.findByRole('button', { name: 'Next' }).should('be.enabled')
}
describe('TRAH-3724 - Verify the account switcher dropdown functionality for adding a real account', () => {
  let accountCreated = false
  let countryCode, currencyCode

  before(() => {
    if (!accountCreated) {
      let countryCode = 'co'
      let currencyCode = 'USD'
      cy.c_createDemoAccount(countryCode, currencyCode)
      accountCreated = true
    }
  })
  const size = ['desktop', 'small']
  size.forEach((size) => {
    it(`Validate account switcher dropdown functionality for CR on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      cy.c_login()
      const isMobile = size == 'small' ? true : false
      cy.log('the ismobile value is ' + size, isMobile)
      cy.c_visitResponsive('/', size)
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
      validateAccountSwticher(isMobile)
    })
  })
  before(() => {
    if (accountCreated) {
      countryCode = 'es'
      currencyCode = 'EUR'
      cy.c_createDemoAccount(countryCode, currencyCode)
      accountCreated = false
    }
  })
  size.forEach((size) => {
    it(`Validate account switcher dropdown functionality for MF on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      cy.c_login()
      const isMobile = size == 'small' ? true : false
      cy.log('the ismobile value is ' + size, isMobile)
      cy.c_visitResponsive('/', size)
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
      validateAccountSwticher(isMobile)
    })
  })
})
