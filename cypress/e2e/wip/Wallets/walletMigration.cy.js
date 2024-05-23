import '@testing-library/cypress/add-commands'

function checkWalletBanner(deviceType) {
  cy.findByRole('heading', { name: 'Why Wallets' }).should('be.visible')
  cy.findByText('Deposit, transfer, trade').should('be.visible')
  cy.findByText('Better funds segregation')
  if (deviceType == 'mobile') {
    cy.findByTestId('dt_swipeable')
      .trigger('touchstart', { force: true, position: 'right' })
      .trigger('touchmove', { force: true, position: 'left' })
      .trigger('touchend', { force: true })
  } else {
    cy.findByRole('button', { name: 'Next' }).click()
  }

  cy.findByText('Ready to enable Wallets', { timeout: 30000 })
  cy.contains('Wallets will become your')
  if (deviceType == 'mobile') {
    cy.findByTestId('dt_swipeable')
      .trigger('touchstart', { force: true, position: 'right' })
      .trigger('touchmove', { force: true, position: 'left' })
      .trigger('touchend', { force: true })
    cy.get('.dc-progress-bar-tracker-circle ').click()
  } else {
    cy.findByRole('button', { name: 'Back' })
    cy.findByRole('button', { name: 'Back' }).click()
  }

  cy.findByRole('heading', { name: 'Why Wallets' }).should('be.visible')
  cy.findByText('Deposit, transfer, trade').should('be.visible')
  cy.findByText('Better funds segregation')
  if (deviceType == 'mobile') {
    cy.get('.dc-swipeable__view')
      .trigger('touchstart', 'right', { force: true, timeout: 1000 })
      .trigger('touchmove', 'left', { force: true })
      .trigger('touchend', { force: true })
    cy.findByRole('button', { name: 'Enable' }).should('exist')
    cy.findAllByTestId('dt_dc_mobile_dialog_close_btn').click()
  } else {
    cy.findByRole('button', { name: 'Next' }).click()
    cy.findByRole('button', { name: 'Enable' }).should('exist')
    cy.get('#modal_root').findAllByRole('button').first().click()
  }
}
function checkAccountNotMigrated() {
  for (let i = 1; i < 4; i++) {
    cy.contains('USD Wallet')
      .should(() => {})
      .then(($text) => {
        if ($text.length) {
          cy.log('Account is migrated!')
          cy.c_logout()
          cy.c_login({ app: 'wallets', user: `eligibleMigration${i}` })
        } else {
          cy.log('account is not migrated!')
          return
        }
      })
  }
}
describe('QATEST-154253 - Migration country eligibility', () => {
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
  })

  it('should be able to see the tour for Fiat Wallets', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    checkAccountNotMigrated()
    cy.contains('Enjoy seamless transactions').should('be.visible')
    cy.get('#modal_root').findByRole('button', { name: 'Enable now' }).click()
    checkWalletBanner('desktop')
    cy.contains('— A smarter way to manage').should('be.visible')
    cy.findByRole('button', { name: 'Enable now' }).click()
    checkWalletBanner('desktop')
  })

  it('should be able to see the tour for Fiat Wallets in responsive', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
    checkAccountNotMigrated()
    cy.contains('Enjoy seamless transactions').should('be.visible')
    cy.get('#modal_root').findByRole('button', { name: 'Enable now' }).click()
    checkWalletBanner('mobile')
    cy.contains('— A smarter way to manage').should('be.visible')
    cy.findByRole('button', { name: 'Enable now' }).click()
    checkWalletBanner('mobile')
  })
})
