import '@testing-library/cypress/add-commands'

describe('QATEST-5948: Verify platforms navigations on Options and Multipliers', () => {
  it('Should navigate to correct platform on clicking Open button', () => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    const derivAppProdUrl = Cypress.env('prodURL')
    const derivAppStagingUrl = Cypress.env('stagingUrl')
    const bBotStagingUrl = Cypress.env('binaryBotUrl').staging
    const bBotProdUrl = Cypress.env('binaryBotUrl').prod
    const smartTraderStagingUrl = Cypress.env('smartTraderUrl').staging
    const smartTraderProdUrl = Cypress.env('smartTraderUrl').prod
    const dBotProdUrl = `${Cypress.env('prodURL')}bot`
    const dBotStagingUrl = `${Cypress.env('stagingUrl')}bot`
    const dTraderStagingUrl = Cypress.env('dTraderUrl').staging
    const dTraderProdUrl = Cypress.env('dTraderUrl').prod

    //Open Dtrader
    cy.findAllByRole('button', { name: 'Open' }).first().click({ force: true })
    cy.get('flt-glass-pane', { timeout: 15000 }).should('be.visible')
    if (Cypress.config().baseUrl.includes('staging'))
      cy.url().should('eql', dTraderStagingUrl)
    else cy.url().should('eql', derivAppProdUrl)

    //Open DBot
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.findAllByRole('button', { name: 'Open' }).eq(1).click({ force: true })
    cy.findByText('Get started on Deriv Bot', { timeout: 15000 }).should(
      'be.visible'
    )
    if (Cypress.config().baseUrl.includes('staging'))
      cy.url().should('eql', dBotStagingUrl)
    else cy.url().should('eql', dBotProdUrl)

    // Open SmartTrader
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.findAllByRole('button', { name: 'Open' }).eq(2).click({ force: true })
    cy.findByRole('heading', { name: 'Rise' }, { timeout: 100000 }).should(
      'be.visible'
    )
    cy.findByRole('heading', { name: 'Fall' }, { timeout: 20000 }).should(
      'be.visible'
    )
    cy.findByRole('link', { name: 'Chart' }, { timeout: 20000 }).should(
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
})
