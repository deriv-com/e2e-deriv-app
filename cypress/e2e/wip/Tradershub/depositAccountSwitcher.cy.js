import '@testing-library/cypress/add-commands'

describe('QATEST 54262 - Verify deposit functionality from account switcher', () => {
  const size = ['small', 'desktop']

  size.forEach((size) => {
    it(`Should validate the deposit button from account switcher on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_login()
      cy.c_visitResponsive('/appstore/traders-hub', size)
      cy.c_checkTradersHubHomePage(isMobile)
      cy.c_switchToReal()
      cy.c_closeNotificationHeader()
      cy.findByRole('button', { name: 'Deposit' }).click()
      cy.url().should('include', '/cashier/deposit')
      cy.findByText('Deposit via bank wire, credit card, and e-wallet').should(
        'be.visible'
      )
    })
  })
})
