import '@testing-library/cypress/add-commands'
import TradersHub from '../pageobjects/traders_hub'
import Common from '../pageobjects/common'

describe('QATEST-136582: Redirection to other pages from dbot', () => {
  const tradersHub = new TradersHub()
  const common = new Common()
  beforeEach(() => {
    cy.c_login({ user: 'dBot' })
    cy.c_visitResponsive('/appstore/traders-hub', 'large', 'check')
    tradersHub.openBotButton.click()
    common.skipTour()
  })

  it('Redirect to deposit page from Dbot', () => {
    cy.findByRole('button', { name: 'Deposit' }).click()
    cy.findByTestId('dt_acc_info').should('be.visible')
    cy.findByText('Deposit via bank wire, credit card, and e-wallet').should(
      'be.visible'
    )
    cy.c_rateLimit()
  })

  it('Switching from Dbot to Dtrader', () => {
    cy.findByTestId('dt_platform_switcher').click()
    cy.c_rateLimit()
    cy.findByTestId('dt_div_100_vh').should('be.visible')
    cy.findByText(
      'A whole new trading experience on a powerful yet easy to use platform.'
    ).click()
    //check if the user is in dtrader page and is logged in
    cy.findByTestId('dt_positions_toggle', { timeout: 5000 }).should(
      'be.visible'
    )
    cy.findByTestId('dt_acc_info').should('be.visible')
  })
})
