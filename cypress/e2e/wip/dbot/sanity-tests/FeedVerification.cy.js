import charts from '../pageobjects/charts'
import '@testing-library/cypress/add-commands'
import TradersHub from '../pageobjects/traders_hub'
import Common from '../pageobjects/common'

describe('QATEST-99340: Verify feed is loading on charts tab', () => {
  const tradersHub = new TradersHub()
  const common = new Common()

  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/bot', 'large')
    cy.c_loadingCheck()
    common.skipTour()
  })

  it('Verify feed for real account', () => {
    charts.openChartsTab()
    charts.selectSymbolOnCharts('Volatility 10 (1s) Index')
    charts.verifyTickChange()

    charts.selectSymbolOnCharts('Gold Basket')
    charts.verifyTickChange()

    charts.selectSymbolOnCharts('AUD/JPY')
    charts.verifyTickChange()

    charts.selectSymbolOnCharts('Gold/USD')
    charts.verifyTickChange()
  })

  // it('Verify feed for demo account', () => {
  //   common.switchToDemo()
  //   charts.openChartsTab()

  //   charts.selectSymbolOnCharts('Volatility 10 (1s) Index')
  //   charts.verifyTickChange(5000)

  //   charts.selectSymbolOnCharts('Gold Basket')
  //   charts.verifyTickChange(5000)

  //   charts.selectSymbolOnCharts('AUD/JPY')
  //   charts.verifyTickChange(5000)

  //   charts.selectSymbolOnCharts('Gold/USD')
  //   charts.verifyTickChange(5000)
  // })
})
