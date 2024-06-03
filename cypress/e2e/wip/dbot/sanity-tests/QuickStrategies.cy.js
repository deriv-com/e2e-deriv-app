import '@testing-library/cypress/add-commands'
import RunPanel from '../pageobjects/run_panel'
import BotBuilder from '../pageobjects/bot_builder_page'
import quickStrategy from '../pageobjects/quick_strategy'

describe('QATEST-4212: Verify Quick Strategy from bot builder page', () => {
  const size = ['small', 'desktop']
  const runPanel = new RunPanel()
  const botBuilder = new BotBuilder()

  beforeEach(() => {
    cy.c_login({ user: 'dBot' })
  })

  size.forEach((size) => {
    it(`Run Martingale Quick Strategy ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('appstore/traders-hub', size)
      if (isMobile) cy.findByText('Maybe later').click()
      cy.c_openDbotThub()
      if (isMobile) cy.findByTestId('close-icon', { timeout: 7000 }).click()
      cy.c_skipTour()
      cy.c_switchToDemoBot()
      botBuilder.openBotBuilderTab()
      cy.c_skipTour()
      cy.get('.bot-dashboard.bot').should('be.visible') //TODO:Update once BOT-1469 done
      //Click on Quick Strategy and fill up the details
      quickStrategy.clickQuickStrategies()
      if (isMobile) {
        cy.get('#dt_components_select-native_select-tag').select('MARTINGALE')
      } else {
        quickStrategy.clickOnStrategyTab('Martingale')
      }
      quickStrategy.quickStrategyMarketDropdown.should(
        'have.value',
        'Volatility 100 (1s) Index'
      )
      cy.findByTestId('qs_autocomplete_tradetype').click()
      if (isMobile) {
        cy.findByText('Matches/Differs', { exact: false }).first().click()
      } else {
        quickStrategy.chooseTradeType()
      }
      quickStrategy.fillUpContractSize()
      quickStrategy.fillUpLossProfitTreshold()
      quickStrategy.runBotQuickStrategy()
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
