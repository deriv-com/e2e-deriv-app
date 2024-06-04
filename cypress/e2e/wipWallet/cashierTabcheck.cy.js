import '@testing-library/cypress/add-commands'

function checkForCashierMenu() {
  cy.contains('CFDs').should('be.visible')
  cy.get('.wallets-trading-account-card')
    .contains('.wallets-text', 'Derived')
    .should('be.visible')
  cy.findByText('Cashier').should('not.exist')
  cy.get('.wallets-options-and-multipliers-listing__content__details')
    .contains('.wallets-text', 'Deriv Trader')
    .should('be.visible')
    .click()
  cy.get('.header__menu-links').should('not.contain', 'Cashier')
  cy.get('.header__menu-links').should('contain', 'Reports')
}
function checkForCashierMenumobile() {
  cy.get('#dt_mobile_drawer_toggle').should('be.visible').click()
  cy.get('.dc-mobile-drawer__header-wrapper')
    .contains('.dc-text', 'Menu')
    .should('be.visible')
  cy.findByText('Reports').should('be.visible')
  cy.findByText('Cashier').should('not.exist')
}
describe('QATEST-156095 -  Cashier tab should not be displayed in the menu', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletloginEmail' })
  })
  it('Cashier tab should not be displayed in the menu for wallet accounts', () => {
    cy.c_visitResponsive('/', 'large')
    checkForCashierMenu()
  })
  it('Responsive - Cashier tab should not be displayed in the menu for wallet accounts ', () => {
    cy.c_visitResponsive('/', 'small')
    checkForCashierMenuMobile()
    cy.get('.dc-mobile-drawer__header-close').click()
    cy.findByText('Options').click()
    cy.get('.wallets-options-and-multipliers-listing__content__details')
      .contains('.wallets-text', 'Deriv Trader')
      .should('be.visible')
      .click()
    checkForCashierMenumobile()
  })
})
