import '@testing-library/cypress/add-commands'
import BotDashboard from '../../../support/pageobjects/dbot/bot_dashboard_page'
import RunPanel from '../../../support/pageobjects/dbot/run_panel'

describe('QATEST-99419: Import and run custom strategy', () => {
  const botDashboard = new BotDashboard()
  const runPanel = new RunPanel()
  let beforePurchaseBalanceString
  let beforePurchaseBalanceNumber
  let afterPurchaseBalanceString

  beforeEach(() => {
    cy.c_login({ user: 'dBot' })
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.c_openDbotThub()
    cy.c_loadingCheck()
    cy.c_skipTour()
    cy.c_switchToDemoBot()
  })

  it('Run Timely Balance Strategy', () => {
    botDashboard.importStrategy('TimelyBalance')
    cy.get('.bot-dashboard.bot').should('be.visible') //TODO:Update once BOT-1469 done
    cy.c_skipTour()

    cy.findByTestId('dt_balance').then(($el) => {
      beforePurchaseBalanceString = $el.text()
      beforePurchaseBalanceNumber = parseFloat(
        $el.text().replace('USD', '').replace(/,/g, '').trim()
      )
    })

    cy.c_runBot()
    cy.c_checkRunPanel()
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
