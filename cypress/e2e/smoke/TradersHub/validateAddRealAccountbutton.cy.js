function validateAccountSwticher(isMobile, brokerCode) {
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
  if (brokerCode == 'CR') {
    cy.findByText('Options & Multipliers').should('be.visible')
  } else {
    cy.findByText('Multipliers').should('be.visible')
  }
  cy.findByRole('button', { name: 'Add' }).should('be.visible')
  cy.findByTestId('acc-switcher').findByTestId('dt_span').should('be.visible')
  cy.findByText('Total assets', { exact: true }).should('be.visible')
  cy.findByTestId('acc-switcher').findByText('Log out').should('be.visible')
  cy.findByRole('button', { name: 'Add' }).click()
  if (brokerCode == 'CR') {
    cy.findByRole('heading', { name: 'Add a Deriv account' }).should(
      'be.visible'
    )
    cy.findByRole('button', { name: 'Next' }).should('be.disabled')
    cy.contains('label', 'US Dollar(USD)').click()
  } else {
    cy.findByRole('heading', { name: 'Setup your account' }).should(
      'be.visible'
    )
    cy.findByRole('button', { name: 'Next' }).should('be.disabled')
    cy.contains('label', 'Euro(EUR)').click()
  }
  cy.findByRole('button', { name: 'Next' }).should('be.enabled')
}
describe('TRAH-3724 - Verify the account switcher dropdown functionality for adding a real account', () => {
  let firstAccountCreated = false
  let secondAccountCreated = false
  const createAccount = (countryCode, currencyCode) => {
    cy.c_createDemoAccount(countryCode, currencyCode)
  }
  const size = ['desktop', 'small']

  size.forEach((size) => {
    it(`Validate account switcher dropdown functionality for CR on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      if (!firstAccountCreated) {
        createAccount('co', 'USD')
        firstAccountCreated = true
      }
      cy.log('firstAccountCreated flag is ' + firstAccountCreated)
      cy.c_login()
      const isMobile = size == 'small' ? true : false
      cy.log('the ismobile value is ' + size, isMobile)
      cy.c_visitResponsive('/', size)
      cy.findAllByTestId('dt_balance_text_container', {
        timeout: 20000,
      }).should('have.length', '2')
      validateAccountSwticher(isMobile, 'CR')
    })
  })
  size.forEach((size) => {
    it(`Validate account switcher dropdown functionality for MF on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      if (!secondAccountCreated) {
        createAccount('es', 'EUR')
        secondAccountCreated = true
      }
      cy.c_login()
      const isMobile = size == 'small' ? true : false
      cy.log('the ismobile value is ' + size, isMobile)
      cy.c_visitResponsive('/', size)
      cy.findAllByTestId('dt_balance_text_container').should('be.visible')
      validateAccountSwticher(isMobile, 'MF')
    })
  })
})
