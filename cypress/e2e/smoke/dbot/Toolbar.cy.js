import BotBuilder from '../../../support/pageobjects/dbot/bot_builder_page'
import BotDashboard from '../../../support/pageobjects/dbot/bot_dashboard_page'

describe('QATEST-99418: Verify toolbar on bot builder page', () => {
  const botDashboard = new BotDashboard()
  const botBuilder = new BotBuilder()
  let strategyName = 'Stock_Netherland_25' + Math.random().toString()

  beforeEach(() => {
    cy.c_login({ user: 'dBot' })
    cy.c_visitResponsive('/bot', 'large')
    cy.c_loadingCheck()
    cy.c_skipTour()
    botBuilder.openBotBuilderTab()
    cy.c_skipTour()
    cy.c_switchToDemoBot()
  })

  it('Save a strategy to local', () => {
    botBuilder.changeMarketOnBlocklyWorkspace(1, 'Stock Indices')
    botBuilder.changeMarketOnBlocklyWorkspace(2, 'European indices')
    botBuilder.saveStrategyFromToolbar(strategyName)
    cy.wait(5000)
    botDashboard.goToDashboard()
    botDashboard.strategySaveStatus(strategyName).should('have.text', 'Local')
  })

  it('Import strategy from local', () => {
    botBuilder.importStrategyFromToolbar('MartingaleOld')
    //TODO:Update once BOT-1469 done
    cy.get('.notification-content').should(
      'have.text',
      'You’ve successfully imported a bot.'
    )
  })
})
