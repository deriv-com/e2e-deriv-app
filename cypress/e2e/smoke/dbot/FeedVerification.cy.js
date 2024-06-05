import charts from '../../../support/pageobjects/dbot/charts'
import '@testing-library/cypress/add-commands'
describe('QATEST-99340: Verify feed is loading on charts tab', () => {
  const size = ['small', 'desktop']
  beforeEach(() => {
    if (Cypress.config().baseUrl === Cypress.env('prodURL')) {
      cy.c_login({ user: 'dBot', rateLimitCheck: true })
    } else {
      cy.c_createRealAccount()
      cy.c_login()
    }
  })
  size.forEach((size) => {
    it(`Verify feed for real and demo account on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('appstore/traders-hub', size)
      //Wait for page to completely load
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
      if (isMobile) cy.c_skipPasskeysV2()
      cy.c_openDbotThub()
      if (isMobile) cy.findByTestId('close-icon', { timeout: 7000 }).click()
      cy.c_skipTour()
      charts.openChartsTab()
      charts.selectSymbolOnCharts('Volatility 10 (1s) Index')
      charts.verifyTickChange(5000)
      charts.selectSymbolOnCharts('Gold Basket')
      charts.verifyTickChange(5000)

      //check feed on demo account
      cy.c_switchToDemoBot()
      charts.openChartsTab()
      charts.selectSymbolOnCharts('AUD/JPY')
      charts.verifyTickChange(5000)
      charts.selectSymbolOnCharts('Gold/USD')
      charts.verifyTickChange(5000)
    })
  })
})
