import '@testing-library/cypress/add-commands'

describe('QATEST-5778, QATEST-5781, QATEST-5615', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive(Cypress.env('tradersHubUrl'), 'large')
  })

  it('Verify account selector, Verify Real and Demo pages and total assets', () => {

    cy.findByTestId('dti_dropdown_display').findByText('Real').click()
    cy.get('#demo').click()
    cy.findByText('Swap-Free Demo').should('be.visible')
    //TODO Match totals
    cy.findByTestId('dti_dropdown_display').findByText('Demo').click()
    cy.get('#real').click()
    cy.findByText('Swap-Free', { exact: true }).should('be.visible')
  
  })

})