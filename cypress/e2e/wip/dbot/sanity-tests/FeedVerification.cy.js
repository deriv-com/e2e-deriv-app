import charts from '../pageobjects/charts'
import '@testing-library/cypress/add-commands'
import TradersHub from '../pageobjects/traders_hub'
import Common from '../pageobjects/common'

describe('QATEST-99340: Verify feed is loading on charts tab', () => {
  const tradersHub = new TradersHub()
  const common = new Common()

  beforeEach(() => {
    if (Cypress.config().baseUrl === Cypress.env('prodURL')) {
      cy.c_login({ user: 'dBot', checkRateLimit: true })
    } else {
      cy.c_visitResponsive('/')
      cy.c_createRealAccount()
      cy.c_login()
    }
    cy.c_visitResponsive('/bot', 'large')
    cy.c_loadingCheck()
    common.skipTour()
  })

  it('Verify feed for real and demo account', () => {
    charts.openChartsTab()
    charts.selectSymbolOnCharts('Volatility 10 (1s) Index')
    charts.verifyTickChange(5000)

    charts.selectSymbolOnCharts('Gold Basket')
    charts.verifyTickChange(5000)

    common.switchToDemo()
    charts.openChartsTab()

    charts.selectSymbolOnCharts('AUD/JPY')
    charts.verifyTickChange(5000)

    charts.selectSymbolOnCharts('Gold/USD')
    charts.verifyTickChange(5000)
  })
})
