describe('QATEST-5918: Verify Change currency functionality for the account which has no balance', () => {
  const size = ['small', 'desktop']
  let newCurrency = Cypress.env('accountCurrency').EUR

  beforeEach(() => {
    cy.c_createCRAccount()
    cy.c_login()
  })

  size.forEach((size) => {
    it(`Should be able to change currency on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('/appstore/traders-hub', size)
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
      if (isMobile) cy.c_skipPasskeysV2()
      cy.c_checkTradersHubHomePage(isMobile)
      cy.findByTestId('dt_currency-switcher__arrow').click()
      cy.findByRole('button', { name: 'Add or manage account' }).click()
      cy.findByText('Fiat currencies').click()
      cy.findByText('Change your currency').should('be.visible')
      cy.findByText('Choose the currency you would like to trade with.').should(
        'be.visible'
      )
      cy.findByText(newCurrency).click()
      cy.findByRole('button', { name: 'Change currency' }).click()
      cy.findByRole('heading', { name: 'Success!' }).should('be.visible', {
        timeout: 30000,
      })
      cy.findByText(
        'You have successfully changed your currency to EUR.'
      ).should('be.visible')
      cy.findByRole('button', { name: 'Deposit now' }).should('be.visible')
      cy.findByRole('button', { name: 'Maybe later' }).click()
    })
  })
})
