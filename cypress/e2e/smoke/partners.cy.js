import '@testing-library/cypress/add-commands'

describe('Partners page', () => {

  it('Validate links and functionality within Partners', () => {
    cy.c_visitResponsive('/partners/deriv-prime/') //See custome command for details

    if (Cypress.env('viewPortSize') == 'small') 
    {
        cy.findByRole('link', { name: 'Contact us' }).click()
        cy.findByRole('heading', { name: 'Contact us' }).should('be.visible')
      //etc
    }
    else 
    {
      //todo - NB desktop links can be different
    }
  })

  //todo - add tests for the remaining sites under About Us.

})