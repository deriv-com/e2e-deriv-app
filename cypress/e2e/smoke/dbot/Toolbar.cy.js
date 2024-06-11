import '@testing-library/cypress/add-commands'
import BotDashboard from '../../../support/pageobjects/dbot/bot_dashboard_page'
import BotBuilder from '../../../support/pageobjects/dbot/bot_builder_page'

describe('QATEST-99418: Verify toolbar on bot builder page', () => {
  const size = ['small', 'desktop']
  const botDashboard = new BotDashboard()
  const botBuilder = new BotBuilder()
  let strategyName = 'Stock_Netherland_25' + Math.random().toString()

  beforeEach(() => {
    cy.c_login({ user: 'dBot' })
  })

  size.forEach((size) => {
    it(`Import and Export strategy from toolbar on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('appstore/traders-hub', size)
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
      if (isMobile) cy.c_skipPasskeysV2()
      cy.c_openDbotThub()
      if (isMobile) cy.findByTestId('close-icon', { timeout: 7000 }).click()
      cy.c_skipTour()
      cy.c_switchToDemoBot()
      botBuilder.openBotBuilderTab()
      cy.c_skipTour()

      botBuilder.changeMarketOnBlocklyWorkspace(1, 'Stock Indices')
      botBuilder.changeMarketOnBlocklyWorkspace(2, 'European indices')
      botBuilder.saveStrategyFromToolbar(strategyName)
      cy.wait(5000)
      botDashboard.goToDashboard()
      botDashboard.strategySaveStatus(strategyName).should('have.text', 'Local')
      cy.log('Importing strategy from Toolbar')
      botBuilder.openBotBuilderTab()
      botBuilder.importStrategyFromToolbar('MartingaleOld')
      cy.c_loadingCheck()
      //TODO:Update once BOT-1469 done
      cy.get('.notification-content').should(
        'have.text',
        'You’ve successfully imported a bot.'
      )
    })
  })
})
