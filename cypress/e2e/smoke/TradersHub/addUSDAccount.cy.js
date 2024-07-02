describe('QATEST-5813: Add USD account for existing BTC account', () => {
  const size = ['small', 'desktop']
  let countryCode = 'co'
  let cryptoCurrency = 'BTC'
  let fiatCurrency = Cypress.env('accountCurrency').USD

  beforeEach(() => {
    cy.c_createCRAccount({
      country_code: countryCode,
      currency: cryptoCurrency,
    })
    cy.c_login()
  })
  size.forEach((size) => {
    it(`Should create a new crypto account and add USD account on ${size == 'small' ? 'mobile' : 'dekstop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('/', size)
      //Wait for page to completely load
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
      if (isMobile) cy.c_skipPasskeysV2()
      cy.c_checkTradersHubHomePage(isMobile)
      cy.c_closeNotificationHeader()
      cy.findAllByTestId('dt_balance_text_container')
        .eq(1)
        .should('contain.text', 'BTC')
      cy.findByTestId('dt_currency-switcher__arrow').click()
      cy.findByRole('button', { name: 'Add or manage account' }).click()
      cy.findByText('Fiat currencies').click()
      cy.findByText(fiatCurrency).click()
      cy.findByRole('button', { name: 'Add account' }).click()
      cy.findByRole('heading', { name: 'Success!' }).should('be.visible', {
        timeout: 30000,
      })
      cy.findByText('You have added a USD account.').should('be.visible')
      cy.findByRole('button', { name: 'Maybe later' }).click()
      cy.findAllByTestId('dt_balance_text_container')
        .eq(1)
        .should('contain.text', 'USD')
    })
  })
})
