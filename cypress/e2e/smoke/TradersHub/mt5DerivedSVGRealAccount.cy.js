describe('QATEST-5972: Create a Derived SVG account', () => {
  const size = ['small', 'desktop']
  let countryCode = 'co'

  beforeEach(() => {
    cy.c_createRealAccount(countryCode)
    cy.c_login()
  })
  size.forEach((size) => {
    it(`Verify I can signup for a real derived SVG CFD account on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('appstore/traders-hub', size)
      if (isMobile) cy.c_skipPasskeysV2()
      cy.c_checkTradersHubHomePage(isMobile)
      if (isMobile) cy.findByRole('button', { name: 'CFDs' }).click()
      cy.findByTestId('dt_trading-app-card_real_standard')
        .findByRole('button', { name: 'Get' })
        .click()
      cy.findByText('St. Vincent & Grenadines').click()
      cy.findByRole('button', { name: 'Next' }).click()
      cy.findByText('Create a Deriv MT5 password').should('be.visible')
      cy.findByText(
        'You can use this password for all your Deriv MT5 accounts.'
      ).should('be.visible')
      cy.findByRole('button', { name: 'Create Deriv MT5 password' }).should(
        'be.disabled'
      )
      cy.findByTestId('dt_mt5_password').type(Cypress.env('mt5Password'), {
        log: false,
      })
      cy.findByRole('button', { name: 'Create Deriv MT5 password' }).click()
      cy.get('.dc-modal-body').should(
        'contain.text',
        'Success!Your Deriv MT5 Standard account is ready. Enable trading with your first transfer.'
      )
      cy.findByRole('button', { name: 'Transfer now' }).should('exist')
      cy.findByRole('button', { name: 'Maybe later' }).click()
      cy.findByText('0.00 USD').should('be.visible')
      cy.findByRole('button', { name: 'Transfer' }).should('exist')
      cy.findByTestId('dt_trading-app-card_real_standard_svg')
        .findByRole('button', { name: 'Open' })
        .click({ force: true })
      cy.get('div.cfd-trade-modal-container')
        .findByText('Standard SVG')
        .should('be.visible')
      cy.get('div.cfd-trade-modal-container')
        .findByText('Deriv (SVG) LLC')
        .should('be.visible')
    })
  })
})
