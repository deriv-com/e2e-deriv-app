import '@testing-library/cypress/add-commands'
import TradersHub from '../pageobjects/traders_hub'
import Common from '../pageobjects/common'
import RunPanel from '../pageobjects/run_panel'
import BotBuilder from '../pageobjects/bot_builder_page'
import quickStrategy from '../pageobjects/quick_strategy'

describe('QATEST-4212: Verify Quick Strategy from bot builder page', () => {
  const tradersHub = new TradersHub()
  const common = new Common()
  const runPanel = new RunPanel()
  const botBuilder = new BotBuilder()

  beforeEach(() => {
    cy.c_login({ user: 'dBot' })
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    tradersHub.openBotButton.click()
    common.blockDashboardLoad()
    common.skipTour()
    common.switchToDemo()
    botBuilder.openBotBuilderTab()
    common.skipTour()
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
