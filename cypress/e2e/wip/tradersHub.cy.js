import '@testing-library/cypress/add-commands'

describe('QATEST-5778, QATEST-5781, QATEST-5615', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })

  it('should be able to use account selector to verify Real and Demo pages.', () => {
    cy.findByTestId('dti_dropdown_display').click()
    cy.get('#real').click()
    cy.findByText('Swap-Free', { exact: true }).should('be.visible')
    cy.findByTestId('dti_dropdown_display').click()
    cy.get('#demo').click()
    cy.findByText('Swap-Free Demo', { exact: true }).should('be.visible')
  })
})
