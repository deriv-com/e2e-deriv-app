import '@testing-library/cypress/add-commands'

describe('QATEST-20318', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })

  it('should be able to open MT5 login from Traders Hub.', () => {

    cy.get('button:nth-child(2)').first().click()
    cy.get('#modal_root').findByRole('link', { name: 'Open' }).should('have.attr', 'href', Cypress.env('mt5BaseUrl') + '/terminal')
  
  })

})
