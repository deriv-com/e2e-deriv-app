import '@testing-library/cypress/add-commands'

describe('QATEST-22853 IDV Document Rejected by Smile Identity provider', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_navigateToPoiResponsive('Ghana')
  })

  it('Should Return IDV Document Rejected', () => {
    cy.get('select[name="document_type"]').select('Passport')
    cy.findByLabelText('Enter your document number').type('G00000001')
    cy.findByTestId('first_name').clear().type('Joe Doe')
    cy.findByTestId('last_name').clear().type('Leo')
    cy.findByTestId('date_of_birth').type('2000-09-20')
    cy.get('.dc-checkbox__box').click()
    cy.findByRole('button', { name: 'Verify' }).click()
    cy.reload()
    cy.contains('ID verification passed').should('be.visible')
    cy.contains('a', 'Continue trading').should('be.visible')
  })
})