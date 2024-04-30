import '@testing-library/cypress/add-commands'
import RunPanel from '../pageobjects/run_panel'
import BotBuilder from '../pageobjects/bot_builder_page'
import quickStrategy from '../pageobjects/quick_strategy'

describe('QATEST-4212: Verify Quick Strategy from bot builder page', () => {
  const runPanel = new RunPanel()
  const botBuilder = new BotBuilder()

  beforeEach(() => {
    cy.c_login({ user: 'dBot' })
    cy.c_visitResponsive('/bot', 'large')
    cy.c_skipTour()
    cy.c_switchToDemoBot()
    botBuilder.openBotBuilderTab()
    cy.c_skipTour()
    cy.get('.bot-dashboard.bot').should('be.visible') //TODO:Update once BOT-1469 done
  })

  it('Run Martingale Quick Strategy', () => {
    quickStrategy.clickQuickStrategies()
    quickStrategy.clickOnStrategyTab('Martingale')
    quickStrategy.quickStrategyMarketDropdown.should(
      'have.value',
      'Volatility 100 (1s) Index'
    )
    quickStrategy.chooseTradeType()
    quickStrategy.fillUpContractSize()
    quickStrategy.fillUpLossProfitTreshold()
    quickStrategy.runBotQuickStrategy()
    runPanel.transactionsTab.click()

    //Verify Stake doubles after a loss
    runPanel.runPanelScrollbar.scrollTo('bottom', { ensureScrollable: false })
    runPanel.transactionAfterFirstLoss.should('have.text', '2.00 USD')
  })
})
