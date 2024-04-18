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
    common.skipTour()
    common.switchToDemo()
  })

  it('Run Timely Balance Strategy', () => {
    botDashboard.importStrategy('TimelyBalance')
    common.blockDashboardLoad()
    common.skipTour()

    common.accountBalance.then(($el) => {
      beforePurchaseBalanceString = $el.text()
      beforePurchaseBalanceNumber = parseFloat(
        common.removeCurrencyCode(common.removeComma($el.text()))
      )
    })

    common.runBot()
    common.stopBot(7000)
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
    cy.findByTestId('dt_acc_info').should('be.visible').click()
    cy.finByText('Log out').click()
    cy.findAllByRole('heading', {
      name: 'Trading for anyone. Anywhere',
    }).should('be.visible')
  })
})
