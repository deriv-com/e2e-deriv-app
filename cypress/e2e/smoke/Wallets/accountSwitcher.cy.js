function goToAcctSwitcherFromTradepage(deviceType) {
  const derivAppProdUrl = `${Cypress.env('prodURL')}dtrader?chart_type=`
  const derivAppStagingUrl = `${Cypress.env('stagingUrl')}dtrader?chart_type=`
  cy.c_skipPasskeysV2() // to check page is loaded completely
  if (deviceType == 'Mobile') {
    cy.c_skipPasskeysV2()
    cy.findAllByText('Options').eq(1).click()
    cy.c_skipPasskeysV2()
  } else {
    cy.get('.wallets-trading-account-card__content')
      .contains('.wallets-text', 'Financial', { timeout: 3000 })
      .parent()
      .closest('.wallets-added-mt5__details, .wallets-available-mt5__details')
  }
  cy.findByText('Deriv Trader').click() //Navigate to Trade page
  if (Cypress.config().baseUrl.includes('staging'))
    cy.url().should('include', derivAppStagingUrl)
  else cy.url().should('include', derivAppProdUrl)
}
function validateAccountSwitcher(CFDbanner) {
  cy.findByTestId('dt_acc_info')
    .should('be.visible')
    .click()
    .then(() => {
      cy.findByRole('heading', {
        name: 'Options accounts',
        timeout: 10000,
      }).should('be.visible')
    })
  cy.get('.acc-switcher-wallet-item__content')
    .should('have.length.greaterThan', 0)
    .each(($el) => {
      cy.wrap($el).find('.dc-text').contains('Options').should('exist')
    })
  cy.get(CFDbanner)
    .contains('.dc-text', 'Looking for CFDs? Go to Trader’s Hub')
    .should('be.visible')
    .click()
    .then(() => {
      cy.findByText('CFDs').should('be.visible')
    })
}
function goToAcctSwitcherFromManagesetting(pageSetting) {
  cy.findByRole('banner').findByTestId('dt_span').findByRole('link').click()
  cy.findByText(pageSetting).should('be.visible')
}

describe('QATEST-129858 -  Validate account switcher ', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletloginEmail' })
  })
  it('Navigate to account switcher from Trade page &  Manage account settings page', () => {
    cy.c_visitResponsive('/', 'large')
    goToAcctSwitcherFromTradepage('Desktop')
    cy.get('#dt_reports_tab').should('be.visible')
    validateAccountSwitcher('.account-switcher-wallet__looking-for-cfds')
    goToAcctSwitcherFromManagesetting('Settings')
    validateAccountSwitcher('.account-switcher-wallet__looking-for-cfds')
  })

  it('Responsive - Navigate to account switcher from Trade page &  Manage account settings page', () => {
    cy.c_visitResponsive('/', 'small')
    cy.c_skipPasskeysV2()
    cy.findByText('Options').click()
    goToAcctSwitcherFromTradepage('Mobile')
    cy.get('#dt_positions_toggle').should('be.visible')
    validateAccountSwitcher('.account-switcher-wallet-mobile__footer')
    goToAcctSwitcherFromManagesetting('Personal details')
    validateAccountSwitcher('.account-switcher-wallet-mobile__footer')
  })
})
