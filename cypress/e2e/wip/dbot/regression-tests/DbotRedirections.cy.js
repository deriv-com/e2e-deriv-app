import '@testing-library/cypress/add-commands'
import TradersHub from '../pageobjects/traders_hub'
import Common from '../pageobjects/common'

describe('Test', () => {
  const tradersHub = new TradersHub()
  const common = new Common()
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })

  it('Redirect to deposit page from Dbot', () => {
    tradersHub.openBotButton.click()
    common.skipTour()
    cy.findByRole('button', { name: 'Deposit' }).click()
    cy.findByTestId('dt_acc_info').should('be.visible')
  })
})
