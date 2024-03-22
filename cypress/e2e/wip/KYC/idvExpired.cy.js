import '@testing-library/cypress/add-commands'

describe('QATEST-22808 IDV Expired scenario', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_navigateToPOIResponsive('Kenya')
  })

  it('should return document expired', () => {
    cy.get('select[name="document_type"]').select('Alien Card')
    cy.get('input[name="document_number"]').type('000000')
    cy.get('input[name="first_name"]').type('Joe Doe')
    cy.get('input[name="last_name"]').type('Leo')
    cy.findByTestId('date_of_birth').click()
    cy.findByText('2000').click()
    cy.findByText('Sep').click()
    cy.findByText('20', { exact: true }).click()
    cy.get('.dc-checkbox__box').click()
    cy.findByRole('button', { name: 'Verify' }).click()
    cy.reload()
    cy.contains('In which country was your document issued?').should(
      'be.visible'
    )
  })
})
