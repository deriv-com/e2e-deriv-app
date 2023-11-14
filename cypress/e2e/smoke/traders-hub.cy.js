import '@testing-library/cypress/add-commands'

describe('QATEST-5778, QATEST-5781, QATEST-5615, QA-TEST-20318', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })

  it('Should be able to use account selector and verify Real and Demo pages.', () => {

    cy.findByTestId('dti_dropdown_display').findByText('Demo').click()
    cy.get('#real').click()
    cy.findByText('Swap-Free', { exact: true }).should('be.visible')
    cy.findByTestId('dti_dropdown_display').findByText('Real').click()
    cy.get('#demo').click()
    cy.findByText('Swap-Free Demo', { exact: true }).should('be.visible')
  
  })

  it('Should be able to open MT5 login from Traders Hub.', () => {

    cy.get('button:nth-child(2)').first().click()
    cy.get('#modal_root').findByRole('link', { name: 'Open' }).should('have.attr', 'href', Cypress.env('mt5BaseUrl') + '/terminal')
  
  })




})
