import '@testing-library/cypress/add-commands'

describe('QATEST-22037 IDV verified by Smile Identity provider', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_navigateToPOIResponsive('Ghana')
  })

  it('Should Return IDV Verified', () => {
    cy.get('select[name="document_type"]').select('Passport')
    cy.findByLabelText('Enter your document number').type('G2380523')
    cy.findByTestId('first_name').clear().type('PRINCE')
    cy.findByTestId('last_name').clear().type('NORBI')
    cy.findByTestId('date_of_birth').type('1985-03-27')
    cy.get('.dc-checkbox__box').click()
    cy.findByRole('button', { name: 'Verify' }).click()
    cy.reload()
    cy.contains('ID verification passed').should('be.visible')
    cy.contains('a', 'Continue trading').should('be.visible')
  })
})
