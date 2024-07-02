import BotBuilder from '../../../support/pageobjects/dbot/bot_builder_page'
import QuickStrategy from '../../../support/pageobjects/dbot/quick_strategy'
import RunPanel from '../../../support/pageobjects/dbot/run_panel'

describe('QATEST-4212: Verify Quick Strategy from bot builder page', () => {
  const size = ['small', 'desktop']
  const runPanel = new RunPanel()
  const botBuilder = new BotBuilder()
  const quickStrategy = new QuickStrategy()

  size.forEach((size) => {
    it(`Run Martingale Quick Strategy on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_login({ user: 'dBot' })
      cy.c_visitResponsive('appstore/traders-hub', size)
      //Wait for page to completely load
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
      if (isMobile) cy.c_skipPasskeysV2()
      cy.c_openDbotThub()
      if (isMobile) cy.findByTestId('close-icon', { timeout: 7000 }).click()
      cy.c_skipTour()
      cy.c_switchToDemoBot()
      botBuilder.openBotBuilderTab()
      cy.c_skipTour()
      quickStrategy.clickQuickStrategies() //Click on Quick Strategy and fill up the details
      if (isMobile) {
        cy.get('#dt_components_select-native_select-tag').select('MARTINGALE')
      } else {
        quickStrategy.clickOnStrategyTab('Martingale')
      }
      quickStrategy.quickStrategyMarketDropdown.should(
        'have.value',
        'Volatility 100 (1s) Index'
      )
      cy.findByTestId('dt_qs_tradetype').click()
      quickStrategy.chooseTradeType(isMobile)
      quickStrategy.fillUpContractSize()
      quickStrategy.fillUpLossProfitTreshold()
      quickStrategy.runBotQuickStrategy()
      cy.get('.bot-dashboard.bot').should('be.visible') //TODO:Update once BOT-1469 done
      //waiting for the bot to stop
      cy.findByRole('button', { name: 'Run' }, { timeout: 120000 }).should(
        'be.visible'
      )
      runPanel.transactionsTab.click()
      //Verify Stake doubles after a loss
      if (isMobile) {
        runPanel.transactionAfterFirstLoss()
      } else {
        runPanel.runPanelScrollbar.scrollTo('bottom', {
          ensureScrollable: false,
        })
        runPanel.transactionAfterFirstLoss()
      }
    })
  })
})
