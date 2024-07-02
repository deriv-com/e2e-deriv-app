import BotDashboard from '../../../support/pageobjects/dbot/bot_dashboard_page'
import QuickStrategy from '../../../support/pageobjects/dbot/quick_strategy'

describe('QATEST-4128: Dashboard quick action to Quick Strategy and Bot Builder', () => {
  const botDashboard = new BotDashboard()
  const quickStrategy = new QuickStrategy()

  const sizes = ['small', 'large']

  sizes.forEach((size) => {
    it(`Go to Bot Builder on ${size === 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size === 'small' ? true : false
      cy.c_visitResponsive('/bot', size)
      if (isMobile) {
        cy.findByTestId('close-icon', { timeout: 7000 }).click()
      }
      cy.c_skipTour()
      botDashboard.openQsQaction()
      botDashboard.botBuilderActiveTab.should('exist')
    })
  })

  sizes.forEach((size) => {
    it(`Go to Quick Strategy on ${size === 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size === 'small' ? true : false
      cy.c_visitResponsive('/bot', size)
      if (isMobile) {
        cy.findByTestId('close-icon', { timeout: 7000 }).click()
      }
      cy.c_skipTour()
      botDashboard.openQsQaction()
      botDashboard.botBuilderActiveTab.should('exist')
      quickStrategy.quickStrategyMarketDropdown.should('be.visible')
    })
  })
})
