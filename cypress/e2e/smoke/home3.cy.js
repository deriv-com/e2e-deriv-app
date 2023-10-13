import '@testing-library/cypress/add-commands'

describe('Validate Hero banner message', () => {

  it('QATEST-1315 - EU', () => {
    cy.c_visitResponsive(Cypress.env('RegionEU')) //See custom command for details

    cy.findByTestId('typewriter-wrapper').findByText('Fo').should('be.visible')
    cy.findByTestId('typewriter-wrapper').findByText('Cr').should('be.visible')
    cy.findByTestId('typewriter-wrapper').findByText('St').should('be.visible')
    cy.findByTestId('typewriter-wrapper').findByText('Co').should('be.visible')
    cy.findByTestId('typewriter-wrapper').findByText('De').should('be.visible')
    cy.findByLabelText('create free demo account').click()
    cy.findByRole('heading', { name: 'Sign up' }).should('be.visible')
  })

})
