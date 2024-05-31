import '@testing-library/cypress/add-commands'

describe('QATEST-153921 -  Client without VRTC', () => {
  it('Client without VRTC should not see  Wallets - Enable now banner', () => {
    cy.c_login({ app: 'wallets', user: 'walletMigrationWithoutVRTC' })
    cy.log('Logged into walletMigrationWithoutVRTC')
    cy.c_checkForBanner()
    cy.findByText('US Dollar').should('be.visible')
    cy.findByTestId('dt_dropdown_display').click()
    cy.get('#demo').click()
    cy.findByText('demo', { exact: true }).should('be.visible')
    cy.findByTestId('dt_traders_hub').findByText('0.00').should('be.visible')
  })
})

describe('QATEST-154139 -  Client with only VRTC', () => {
  it('Client with only VRTC should not see  Wallets - Enable now banner', () => {
    cy.c_login({ app: 'wallets', user: 'walletMigrationVRTConly' })
    cy.log('Logged into walletMigrationVRTConly')
    cy.c_checkForBanner()
    cy.findByText('demo', { exact: true }).should('be.visible')
    cy.findByTestId('dt_dropdown_display').click()
    cy.get('#real').click()
    cy.findByRole('heading', { name: 'Add a Deriv account' }).should(
      'be.visible'
    )
    cy.findByRole('heading', { name: 'Select your preferred currency' }).should(
      'be.visible'
    )
  })
})
