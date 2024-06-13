describe('QATEST-153921 -  Client without VRTC', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletMigrationNoVRTC' })
  })
  it('Client without VRTC should not see  Wallets - Enable now banner', () => {
    cy.c_visitResponsive('/', 'large')
    cy.c_checkForBanner()
    cy.findByText('US Dollar').should('be.visible')
    cy.c_switchToDemo()
    cy.findByTestId('dt_traders_hub').findByText('0.00').should('be.visible')
  })
  it('Client without VRTC should not see  Wallets - Enable now banner - Responsive', () => {
    cy.c_visitResponsive('/', 'small')
    cy.c_checkForBanner()
    cy.findByText('US Dollar').should('be.visible')
    cy.c_closeNotificationHeader()
    cy.c_switchToDemo()
    cy.findByTestId('dt_traders_hub').findByText('0.00').should('be.visible')
  })
})

describe('QATEST-154139 -  Client with only VRTC', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletMigrationVRTConly' })
  })
  it('Client with only VRTC should not see  Wallets - Enable now banner', () => {
    cy.c_visitResponsive('/', 'large')
    cy.c_checkForBanner()
    cy.findByText('demo', { exact: true }).should('be.visible')
    cy.c_switchToReal()
    cy.findByRole('heading', { name: 'Add a Deriv account' }).should(
      'be.visible'
    )
    cy.findByRole('heading', { name: 'Select your preferred currency' }).should(
      'be.visible'
    )
  })
  it('Responsive - Client with only VRTC should not see  Wallets - Enable now banner', () => {
    cy.c_visitResponsive('/', 'small')
    cy.c_checkForBanner()
    cy.findByText('demo', { exact: true }).should('be.visible')
    cy.c_closeNotificationHeader()
    cy.c_switchToReal()
    cy.findByRole('heading', { name: 'Add a Deriv account' }).should(
      'be.visible'
    )
    cy.get('.account-wizard__header-steps')
      .contains('.dc-text', 'Step 1: Account currency (1 of 4)')
      .should('be.visible')
  })
})
