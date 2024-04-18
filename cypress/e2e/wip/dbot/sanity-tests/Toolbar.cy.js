import '@testing-library/cypress/add-commands'
import TradersHub from '../pageobjects/traders_hub'
import Common from '../pageobjects/common'
import BotDashboard from '../pageobjects/bot_dashboard_page'
import BotBuilder from '../pageobjects/bot_builder_page'

describe('QATEST-99418: Verify toolbar on bot builder page', () => {
  const tradersHub = new TradersHub()
  const common = new Common()
  const botDashboard = new BotDashboard()
  const botBuilder = new BotBuilder()
  let strategyName = 'Stock_Netherland_25' + Math.random().toString()

  beforeEach(() => {
    cy.c_login({ user: 'dBot' })
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    tradersHub.openBotButton.click()
    cy.c_loadingCheck()
    common.skipTour()
    common.switchToDemo()
    botBuilder.openBotBuilderTab()
    common.skipTour()
  })

  it('Save a strategy to local', () => {
    botBuilder.changeMarketOnBlocklyWorkspace(1, 'Stock Indices')
    botBuilder.changeMarketOnBlocklyWorkspace(2, 'European indices')
    botBuilder.changeMarketOnBlocklyWorkspace(3, 'Netherlands 25')
    botBuilder.saveStrategyFromToolbar(strategyName)
    cy.wait(5000)
    botDashboard.goToDashboard()
    botDashboard.strategySaveStatus(strategyName).should('have.text', 'Local')
  })

  it('Import strategy from local', () => {
    botBuilder.importStrategyFromToolbar('MartingaleOld')
    common.snackBar.should('have.text', 'You’ve successfully imported a bot.')
  })
  after(() => {
    cy.findByTestId('dt_acc_info').should('be.visible').click()
    cy.finByText('Log out').click()
    cy.findAllByRole('heading', {
      name: 'Trading for anyone. Anywhere',
    }).should('be.visible')
  })
})
