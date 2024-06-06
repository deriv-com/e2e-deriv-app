import '@testing-library/cypress/add-commands'

function checkForCashierMenu() {
  cy.findByText('CFDs', { exact: true }).should('be.visible')
  cy.findByRole('button', { name: /Derived SVG [\d.,]+ USD/ }).should(
    'be.visible'
  )
  cy.findByText('Cashier').should('not.exist')
  cy.get('.wallets-options-and-multipliers-listing__content__details')
    .contains('.wallets-text', 'Deriv Trader')
    .should('be.visible')
    .click()
  cy.findByRole('link', { name: 'Cashier Cashier' }).should('not.exist')
  cy.findByText('Reports').should('be.visible').trigger('mouseover')
}
function checkForCashierMenuMobile() {
  cy.get('#dt_mobile_drawer_toggle').should('be.visible').click({ force: true })
  cy.findByText('Menu').should('be.visible')
  cy.findByRole('heading', { name: 'Reports' }).should('be.visible')
  cy.findByRole('heading', { name: 'Cashier' }).should('not.exist')
  cy.get('.dc-mobile-drawer__header-close').click()
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
    cy.findByRole('button', { name: /Derived SVG [\d.,]+ USD/ }).should(
      'be.visible'
    )
    cy.findByRole('button', { name: 'Options' }).click({ force: true })
    cy.get('.wallets-options-and-multipliers-listing__content__details')
      .contains('.wallets-text', 'Deriv Trader')
      .should('be.visible')
      .click()
    cy.findByTestId('dt_positions_toggle').should('be.visible')
    checkForCashierMenuMobile()
  })
})
