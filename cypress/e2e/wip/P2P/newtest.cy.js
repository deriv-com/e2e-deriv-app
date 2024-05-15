import '@testing-library/cypress/add-commands'

let isSellAdUser = true
const loginWithNewUser = (userAccount, isSellAdUserAccount) => {
  Cypress.prevAppId = 0
  cy.c_login({ user: userAccount, rateLimitCheck: true })
  isSellAdUser = isSellAdUserAccount
}

describe('test', () => {
  before(() => {
    cy.clearAllSessionStorage()
  })
  beforeEach(() => {
    if (isSellAdUser == true) {
      loginWithNewUser('p2pFloatingSellOrderSeller', false)
    } else {
      loginWithNewUser('p2pFloatingSellOrderBuyer', true)
    }
    cy.c_visitResponsive('/appstore/traders-hub', 'small'),
      {
        rateLimitCheck: true,
      }
  })

  it('test', () => {
    cy.c_navigateToDerivP2P()
    cy.c_closeSafetyInstructions()
    cy.c_closeNotificationHeader()
    cy.findAllByRole('button', { name: 'Sell' }).click()
    cy.findAllByRole('button', { name: 'Sell USD' }).click()
    cy.findAllByRole('button', { name: 'Confirm' }).should('be.disabled')
    cy.get('textarea[name="payment_info"]').should('be.visible').type('Test')
    cy.get('textarea[name="contact_info"]').should('be.visible').type('Test')
    cy.findAllByRole('button', { name: 'Confirm' }).should('be.enabled').click()
    cy.findByText('Wait for payment').should('be.visible')
    cy.get('[id="dt_mobile_drawer_toggle"]').click()
    cy.findByText("Trader's Hub").should('be.visible').click()
    cy.findAllByRole('button', { name: 'Open' })
      .first()
      .should('be.visible')
      .click()
  })
})
