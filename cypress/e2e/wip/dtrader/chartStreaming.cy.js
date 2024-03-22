import '@testing-library/cypress/add-commands'
import '../../../support/dtrader'

describe('QATEST-6247 - Verify if chart streaming is working with feeds', () => {
  beforeEach(() => {
    cy.c_visitResponsive('', 'large')
    localStorage.setItem('config.server_url', Cypress.env('configServer'))
    localStorage.setItem('config.app_id', Cypress.env('configAppId'))
  })

  it('should update the line chart', () => {
    cy.get('flt-glass-pane').should('exist')
    cy.wait(10000) //need to wait for 10 seconds because there is no deterministic way to ensure that the chart has started streaming
    cy.c_compareElementScreenshots(
      '.flutter-chart',
      'initial-state',
      'updated-state',
      'diff-state'
    )
  })
})
