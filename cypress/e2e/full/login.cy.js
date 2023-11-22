import '@testing-library/cypress/add-commands'

describe('Validate login functionality', () => {
  beforeEach(() => {
    //cy.c_visitResponsive(Cypress.env('RegionEU'), 'large')
  })

  it('should validate that a user can login via the EU/non-EU Website', () => {

    cy.c_visitResponsive('https://app.deriv.com', 'large')
    cy.c_visitResponsive('https://app.deriv.com/endpoint', 'large')
    cy.findByLabelText('Server').click({force: true})
    cy.findByLabelText('Server').clear()
    cy.findByLabelText('Server').type('qa10.deriv.dev')
    cy.findByLabelText('OAuth App ID').click( {force: true} )
    cy.findByLabelText('OAuth App ID').clear()
    cy.findByLabelText('OAuth App ID').type('1006')

    cy.origin('https://qa10.deriv.dev', () => {
      cy.visit('/oauth2/authorize?app_id=1006&l=EN&signup_device=desktop&date_first_contact=2023-11-21&brand=deriv')
      cy.get('#txtEmail').click()
      cy.get('#txtEmail').type('mark1@deriv.com')
      cy.get('#txtPass').click()
      cy.get('#txtPass').type('Abcd1234')
      cy.get('#lost-password-container > .button').click()
      cy.wait(10000)
    })

  })
})
