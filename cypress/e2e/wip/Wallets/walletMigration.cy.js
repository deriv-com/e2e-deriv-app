import '@testing-library/cypress/add-commands'

function checkWalletBanner() {
  cy.findByRole('heading', { name: 'Why Wallets' }).should('be.visible')
  cy.findByText('Deposit, transfer, trade').should('be.visible')
  cy.findByText('Better funds segregation')
  cy.findByRole('button', { name: 'Next' }).click()
  cy.findByText('Ready to enable Wallets').should('be.visible')
  cy.contains('Wallets will become your').should('be.visible')
  cy.findByRole('button', { name: 'Back' }).should('be.visible')
  cy.findByRole('button', { name: 'Back' }).click()
  cy.findByRole('heading', { name: 'Why Wallets' }).should('be.visible')
  cy.findByText('Deposit, transfer, trade').should('be.visible')
  cy.findByText('Better funds segregation')
  cy.findByRole('button', { name: 'Next' }).click()
  cy.findByRole('button', { name: 'Enable' }).should('be.visible')
  // close pop up
  cy.get('#modal_root').findAllByRole('button').first().click()
}
describe('QATEST-154253 - Migration country eligibility', () => {
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
  })

  it('should be able to see the tour for Fiat Wallets', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.contains('Enjoy seamless transactions').should('be.visible')
    cy.get('#modal_root').findByRole('button', { name: 'Enable now' }).click()
    checkWalletBanner()
    cy.contains('— A smarter way to manage').should('be.visible')
    cy.findByRole('button', { name: 'Enable now' }).click()
    checkWalletBanner()
  })

  it.only('should be able to see the tour for Fiat Wallets in responsive', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
    cy.contains('Enjoy seamless transactions').should('be.visible')
    cy.get('#modal_root').findByRole('button', { name: 'Enable now' }).click()
    checkWalletBanner()
    cy.contains('— A smarter way to manage').should('be.visible')
    cy.findByRole('button', { name: 'Enable now' }).click()
    checkWalletBanner()
  })
})
