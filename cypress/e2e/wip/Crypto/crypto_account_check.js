import '@testing-library/cypress/add-commands'


describe('QATEST-707 - Create crypto account', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })



  it('should be able to create crypto account from Traders Hub.', () => {
   cy.findByTestId('dt_currency-switcher__arrow').should('be.visible').click()
    cy.get('[class*="dc-btn dc-btn--secondary dc-btn__large block-button"]').should('be.visible').click()
    cy.findByText("Bitcoin").click()
    cy.get('[class*="dc-btn dc-btn__effect dc-btn--primary dc-btn__large"]').should('be.visible').click()
    cy.findByRole('button', { name: 'Maybe later' }).click()
    cy.get('.notification__close-button').should("be.visible").first().click();
    cy.findByTestId('dt_currency-switcher__arrow').should('be.visible').click()
    cy.findByText("0.00000000 BTC").should("be.visible")
  })
})
