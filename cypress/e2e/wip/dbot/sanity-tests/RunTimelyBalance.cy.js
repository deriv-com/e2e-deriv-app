import '@testing-library/cypress/add-commands'
import TradersHub from '../pageobjects/traders_hub'
import Common from '../pageobjects/common'
import BotDashboard from '../pageobjects/bot_dashboard_page'
import RunPanel from '../pageobjects/run_panel'

describe('QATEST-99419: Import and run custom strategy', () => {
  const tradersHub = new TradersHub()
  const common = new Common()
  const botDashboard = new BotDashboard()
  const runPanel = new RunPanel()
  let beforePurchaseBalanceString
  let beforePurchaseBalanceNumber
  let afterPurchaseBalanceString

  beforeEach(() => {
    cy.c_login({ user: 'dBot' })
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    tradersHub.openBotButton.click()
    cy.c_loadingCheck()
    cy.findByText('Skip').should('be.visible').click({ force: true })
    cy.c_switchToDemoBot()
  })

  it('Run Timely Balance Strategy', () => {
    botDashboard.importStrategy('TimelyBalance')
    cy.get('.bot-dashboard.bot').should('be.visible')
    cy.findByText('Skip').should('be.visible').click({ force: true })

    cy.get('.acc-info__balance').then(($el) => {
      beforePurchaseBalanceString = $el.text()
      beforePurchaseBalanceNumber = parseFloat(
        common.removeCurrencyCode(common.removeComma($el.text()))
      )
    })

    cy.c_runBot()
    cy.c_stopBot(7000)
    runPanel.journalTab.click()
    runPanel.runPanelScrollbar
      .scrollTo('bottom', { ensureScrollable: false })
      .then(() => {
        runPanel.secondBeforePurchaseText.then(($el) => {
          afterPurchaseBalanceString = $el
            .text()
            .replace('[BEFORE_PURCHASE]:', '[AFTER_PURCHASE]:')
          runPanel.afterPurchase.should(
            'contain.text',
            afterPurchaseBalanceString
          )
        })
        runPanel.beforePurchase.should(
          'contain.text',
          `[BEFORE_PURCHASE]:   Number:  ${beforePurchaseBalanceNumber}      --      String:  ${beforePurchaseBalanceString}`
        )
      })
  })

  after(() => {
    botDashboard.deleteStrategy()
  })
})
