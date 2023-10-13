import '@testing-library/cypress/add-commands'

describe('Markets page', () => {

  it('Validate links within Markets - Forex', () => {
    cy.c_visitResponsive('/markets/forex') //See custome command for details

    if (Cypress.env('viewPortSize') == 'small') 
    {
      cy.findByRole('link', { name: 'Check trading specs' }).click()
      cy.findByText('Trading specifications for CFDs on Deriv').should('be.visible')
      cy.findByRole('link', { name: 'Deriv MT5 Deriv MT5' }).click()
      cy.findByRole('heading', { name: 'The all-in-one CFD trading platform' }).should('be.visible')
      //etc
    }
    else 
    {
      //todo - NB desktop locators can be different
    }
  })

  it('Validate links within Markets - Derived indices', () => {
    cy.c_visitResponsive('/markets/synthetic') //See custome command for details

    if (Cypress.env('viewPortSize') == 'small') 
    {
      cy.findByRole('link', { name: 'Check trading specs' }).click()
      cy.findByText('Trading specifications for CFDs on Deriv').should('be.visible')
      cy.findByRole('link', { name: 'Deriv MT5 Deriv MT5' }).click()
      cy.findByRole('heading', { name: 'The all-in-one CFD trading platform' }).should('be.visible')
      //etc
    }
    else 
    {
      //todo - NB desktop locators can be different
    }
  })

  //todo - add tests for the remaining sites under Markets.
})
