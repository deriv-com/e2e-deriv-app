import '@testing-library/cypress/add-commands'
import BotDashboard from '../pageobjects/bot_dashboard_page'
import quickStrategy from '../pageobjects/quick_strategy'

describe('QATEST-4128: Dashboard quick action to Quick Strategy and Bot Builder', () => {
  const botDashboard = new BotDashboard()

  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/bot', 'large')
    cy.c_skipTour()
    cy.c_closeNotificationHeader()
  })

  it('Go to bot builder page', () => {
    botDashboard.openBotBuilderQaction()
    cy.c_skipTour()
    botDashboard.botBuilderActiveTab.should('exist')
  })

  it('Open quick strategy modal', () => {
    botDashboard.openQsQaction()
    botDashboard.botBuilderActiveTab.should('exist')
    quickStrategy.quickStrategyMarketDropdown.should('be.visible')
  })
})
