import '@testing-library/cypress/add-commands'

describe('QATEST-5948: Verify platforms navigations on Options and Multipliers', () => {
  beforeEach(() => {
    cy.c_login()
  })

  //TODO fix the issue reported in https://app.clickup.com/t/20696747/TRAH-3245 and then update it.skip to it
  it.skip('Should navigate to correct platform on clicking Open button', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    const derivAppProdUrl = Cypress.env('prodURL')
    const derivAppStagingUrl = Cypress.env('stagingUrl')
    const bBotStagingUrl = Cypress.env('binaryBotUrl').staging
    const bBotProdUrl = Cypress.env('binaryBotUrl').prod
    const smartTraderStagingUrl = Cypress.env('smartTraderUrl').staging
    const smartTraderProdUrl = Cypress.env('smartTraderUrl').prod
    const dBotProdUrl = `${Cypress.env('prodURL')}bot`
    const dBotStagingUrl = `${Cypress.env('stagingUrl')}bot`

    //Open Dtrader
    cy.findAllByRole('button', { name: 'Open' }).first().click({ force: true })
    cy.get('flt-glass-pane', { timeout: 15000 }).should('be.visible')
    if (Cypress.config().baseUrl.includes('staging'))
      cy.url().should('satisfy', (url) => {
        return url.includes(derivAppStagingUrl)
      })
    else
      cy.url().should('satisfy', (url) => {
        return url.includes(derivAppProdUrl)
      })

    //Open DBot
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.findAllByRole('button', { name: 'Open' }).eq(1).click({ force: true })
    cy.findByText('Get started on Deriv Bot', { timeout: 15000 }).should(
      'be.visible'
    )
    if (Cypress.config().baseUrl.includes('staging'))
      cy.url().should('eql', dBotStagingUrl)
    else cy.url().should('eql', dBotProdUrl)

    //Open SmartTrader
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.findAllByRole('button', { name: 'Open' }).eq(2).click({ force: true })
    cy.findByRole('heading', { name: 'Rise' }, { timeout: 15000 }).should(
      'be.visible'
    )
    cy.findByRole('heading', { name: 'Fall' }, { timeout: 15000 }).should(
      'be.visible'
    )
    cy.findByRole('link', { name: 'Chart' }, { timeout: 15000 }).should(
      'be.visible'
    )
    if (Cypress.config().baseUrl.includes('staging'))
      cy.url().should('include', smartTraderStagingUrl)
    else cy.url().should('include', smartTraderProdUrl)

    //Open BinaryBot
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.findAllByRole('button', { name: 'Open' }).eq(3).click({ force: true })
    cy.findByText('Take your bot trading to the next level', {
      timeout: 15000,
    }).should('be.visible')
    if (Cypress.config().baseUrl.includes('staging'))
      cy.url().should('eq', bBotStagingUrl)
    else cy.url().should('eq', bBotProdUrl)
  })
  it('should remain logged in after redirection to another platform', () => {
    cy.findByTestId('dt_platform_switcher').click()
    cy.findByText(
      'Automated trading at your fingertips. No coding needed.'
    ).click()
    cy.findByRole('button', { name: 'Skip' }).click()
    cy.findByText('Charts').click()
    cy.get('.cq-symbol-select-btn').click()
    cy.get('#dbot').findByText('Volatility 10 (1s) Index').click()
    cy.findByTestId('dt_platform_switcher').click()
    cy.findByText(
      'A whole new trading experience on a powerful yet easy to use platform.'
    ).click()
    // Verify the chart loaded
    cy.get('.chart-container__loader').should('not.exist', { timeout: 10000 })
    // Verify account remained logged in
    cy.findByRole('button', { name: 'Deposit' }).should('exist')
  })
})
