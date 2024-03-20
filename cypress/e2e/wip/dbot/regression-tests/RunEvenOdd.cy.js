import '@testing-library/cypress/add-commands'
import Common from '../pageobjects/common'
import BotDashboard from '../pageobjects/bot_dashboard_page'
import RunPanel from '../pageobjects/run_panel'
import BotBuilder from '../pageobjects/bot_builder_page'

describe('QATEST-109419: Run custom strategy Even Odd', () => {
  const common = new Common()
  const botDashboard = new BotDashboard()
  const runPanel = new RunPanel()
  const botBuilder = new BotBuilder()

  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/bot', 'large')
    common.skipTour()
    common.switchToDemo()
  })

  it('Run Even and Odd Purchase', () => {
    botDashboard.importStrategy('EvenOdd')
    common.skipTour()
    cy.reload() // adding this until bug BOT-1147 is fixed
    cy.c_loadingCheck()
    common.runBot()
    common.stopBot(10000)
    runPanel.transactionsTab.click() //Switch to transactions tab

    //getting the positions of even and odd purchase conditions
    botBuilder.digitEvenLogo.should('exist').then(($elem2) => {
      botBuilder.digitOddLogo.should('exist').then(($elem1) => {
        const icon1 = $elem1[0].getBoundingClientRect()
        const icon2 = $elem2[0].getBoundingClientRect()
        // Ensure that even it purchased first then odd from txn list
        expect(icon1.top).to.be.lessThan(icon2.top)
      })
    })
  })

  after(() => {
    botDashboard.deleteStrategy()
  })
})
