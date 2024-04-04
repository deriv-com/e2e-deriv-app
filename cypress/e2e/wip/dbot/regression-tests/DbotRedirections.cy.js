import '@testing-library/cypress/add-commands'
import TradersHub from '../pageobjects/traders_hub'
import Common from '../pageobjects/common'

describe('QATEST-136582: Redirection to other pages from dbot', () => {
  const tradersHub = new TradersHub()
  const common = new Common()
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    tradersHub.openBotButton.click()
    common.skipTour()
  })

  it('Redirect to deposit page from Dbot', () => {
    cy.findByRole('button', { name: 'Deposit' }).click()
    cy.findByTestId('dt_acc_info').should('be.visible')
    cy.findByText('Deposit via bank wire, credit card, and e-wallet').should(
      'be.visible'
    )
  })

  it('Switchingfrom Dbot to Dtrader', () => {
    cy.findByTestId('dt_platform_switcher').click()
    cy.get('.platform-dropdown__list').should('be.visible')
    cy.findByText(
      'A whole new trading experience on a powerful yet easy to use platform.'
    ).click()
    cy.get('.cq-symbol-select-btn', { timeout: 10000 }).should('exist')
  })
})
