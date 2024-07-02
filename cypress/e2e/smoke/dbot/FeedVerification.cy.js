import charts from '../../../support/pageobjects/dbot/charts'

describe('QATEST-99340: Verify feed is loading on charts tab', () => {
  const size = ['small', 'desktop']
  beforeEach(() => {
    if (Cypress.config().baseUrl === Cypress.env('prodURL')) {
      cy.c_login({ user: 'dBot', rateLimitCheck: true })
    } else {
      cy.c_createCRAccount()
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
      cy.c_loadingCheck()
      cy.findByText('Retrieving Chart Data...').should('not.be.visible')
      if (size === 'desktop') {
        cy.log('Checking feed on real account')
        charts.selectSymbolOnCharts('Volatility 10 (1s) Index')
        charts.verifyTickChange(5000)
        charts.selectSymbolOnCharts('Gold Basket')
        charts.verifyTickChange(5000)
      } else {
        cy.c_switchToDemoBot()
        cy.log('Checking feed on demo account')
        charts.selectSymbolOnCharts('AUD/JPY')
        charts.verifyTickChange(5000)
        charts.selectSymbolOnCharts('Gold/USD')
        charts.verifyTickChange(5000)
      }
    })
  })
})
