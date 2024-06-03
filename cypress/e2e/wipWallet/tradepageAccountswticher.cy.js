import '@testing-library/cypress/add-commands'
function validateAccountSwitcher(swticherTitle, CFDbanner) {
  cy.findByTestId('dt_acc_info')
    .should('be.visible')
    .click()
    .then(() => {
      cy.findByRole('heading', {
        name: 'Options accounts',
        timeout: 20000,
      }).should('be.visible')
    })
  cy.log('the parm passed' + CFDbanner)
  cy.log('2nd parm ' + swticherTitle)
  cy.get(swticherTitle)
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
function navigateToaccountSwitcher() {
  const derivAppProdUrl = `${Cypress.env('prodURL')}dtrader?chart_type=`
  const derivAppStagingUrl = `${Cypress.env('stagingUrl')}dtrader?chart_type=`
  cy.get('.wallets-deriv-apps-section__title-and-badge')
    .contains('.wallets-text', 'Options')
    .should('be.visible')
    .then(() => {
      cy.get('.wallets-list-card__badge')
        .contains('.wallets-text', 'SVG')
        .should('be.visible')
      cy.get('.wallets-options-and-multipliers-listing__content__details')
        .contains('.wallets-text', 'Deriv Trader')
        .should('be.visible')
        .click() //Navigate to Trade page
      if (Cypress.config().baseUrl.includes('staging'))
        cy.url().should('include', derivAppStagingUrl)
      else cy.url().should('include', derivAppProdUrl)
    })
}

describe('QATEST-129858 -  Trade page account switcher', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletloginEmail' })
  })
  it('Navigate to account swticher from Trade page &  Manage account settings page', () => {
    cy.c_visitResponsive('/', 'large')
    navigateToaccountSwitcher()
    cy.get('#dt_reports_tab').should('be.visible')
    validateAccountSwitcher(
      '.acc-switcher-wallet-item__content',
      '.account-switcher-wallet__looking-for-cfds'
    )
    cy.findByRole('banner').findByTestId('dt_span').findByRole('link').click()
    cy.findByText('Settings').should('be.visible')
    validateAccountSwitcher(
      '.acc-switcher-wallet-item__content',
      '.account-switcher-wallet__looking-for-cfds'
    )
  })

  it('Responsive - Navigate to account swticher from Trade page &  Manage account settings page', () => {
    cy.c_visitResponsive('/', 'small')
    cy.findByText('Options').click()
    navigateToaccountSwitcher()
    cy.get('#dt_positions_toggle').should('be.visible')
    validateAccountSwitcher(
      '.acc-switcher-wallet-item__content',
      '.account-switcher-wallet-mobile__footer'
    )
  })
})
