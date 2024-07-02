import BotBuilder from '../../../support/pageobjects/dbot/bot_builder_page'
import BotDashboard from '../../../support/pageobjects/dbot/bot_dashboard_page'
import RunPanel from '../../../support/pageobjects/dbot/run_panel'

describe('QATEST-109419: Run custom strategy Even Odd', () => {
  const size = ['small', 'desktop']
  const botDashboard = new BotDashboard()
  const runPanel = new RunPanel()
  const botBuilder = new BotBuilder()

  size.forEach((size) => {
    it(`Run Even and Odd Purchase on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
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
      botDashboard.importStrategy('EvenOdd')
      if (isMobile) {
        botDashboard.moreActionButton.click({ force: true })
        cy.findAllByTestId('dt_mobile_bot_list_action-open').click({
          force: true,
        })
      } else {
        cy.findAllByTestId('dt_desktop_bot_list_action-open').click()
      }
      cy.c_skipTour()
      cy.c_runBot()
      cy.c_stopBot(10000)
      runPanel.transactionsTab.click() //Switch to transactions tab

      //getting the positions of even and odd purchase conditions
      botBuilder.digitEvenLogo.should('exist').then(($elem2) => {
        botBuilder.digitOddLogo.should('exist').then(($elem1) => {
          const icon1 = $elem1[0].getBoundingClientRect()
          const icon2 = $elem2[0].getBoundingClientRect()
          // Ensure that even it purchased first then odd from txn list
          expect(icon1.top).to.be.lessThan(icon2.top)
          cy.c_checkRunPanel(true)
        })
      })
      //delete the uploaded strategy
      cy.c_deleteStrategy(isMobile)
    })
  })
})
