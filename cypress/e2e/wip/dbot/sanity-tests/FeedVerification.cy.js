import charts from '../pageobjects/charts'
import '@testing-library/cypress/add-commands'
import TradersHub from '../pageobjects/traders_hub'

describe('QATEST-99340: Verify feed is loading on charts tab', () => {
  const tradersHub = new TradersHub()
  const sizes = ['small', 'large']

  sizes.forEach((size) => {
    const isMobile = size == 'small' ? true : false
    beforeEach(() => {
      if (Cypress.config().baseUrl === Cypress.env('prodURL')) {
        cy.c_login({ user: 'dBot', rateLimitCheck: true })
      } else {
        cy.c_visitResponsive('/', size)
        cy.c_createRealAccount()
        cy.c_login()
      }
      cy.c_visitResponsive('/bot', size)
      cy.c_loadingCheck()
      if (isMobile) cy.findByTestId('close-icon', { timeout: 7000 }).click()
      cy.c_skipTour()
    })

    it(`Verify feed for real and demo account ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      charts.openChartsTab()
      charts.selectSymbolOnCharts('Volatility 10 (1s) Index')
      charts.verifyTickChange(5000)

      charts.selectSymbolOnCharts('Gold Basket')
      charts.verifyTickChange(5000)

      cy.c_switchToDemoBot()
      charts.openChartsTab()

      charts.selectSymbolOnCharts('AUD/JPY')
      charts.verifyTickChange(5000)

      charts.selectSymbolOnCharts('Gold/USD')
      charts.verifyTickChange(5000)
    })
  })
})
