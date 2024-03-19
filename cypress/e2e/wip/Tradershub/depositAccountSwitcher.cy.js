import '@testing-library/cypress/add-commands'

describe('QATEST 54262 - Verify deposit functionality from account switcher', () => {
  it('Should validate the deposit button from account switcher in desktop', () => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.c_checkTradersHubhomePage()
    cy.findByTestId('dt_dropdown_display').click()
    cy.get('#real').click()
    cy.c_closeNotificationHeader()
    cy.findByRole('button', { name: 'Deposit' }).click()
    cy.url().should('include', '/cashier/deposit')
    cy.findByText('Deposit via bank wire, credit card, and e-wallet').should(
      'be.visible'
    )
  })
})
