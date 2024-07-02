describe('QATEST-22037 IDV verified by Smile Identity provider', () => {
  beforeEach(() => {
    cy.c_createCRAccount({ country_code: 'za' })
    cy.c_login()
    cy.c_navigateToPoiResponsive('South Africa')
  })

  it('Should Return IDV Verified', () => {
    cy.get('select[name="document_type"]').select('National ID Number')
    cy.findByLabelText('Enter your document number').type('0000000000000')
    cy.findByTestId('first_name').clear().type('Joe')
    cy.findByTestId('last_name').clear().type('Leo')
    cy.findByTestId('date_of_birth').type('2000-09-20')
    cy.get('.dc-checkbox__box').click()
    cy.findByRole('button', { name: 'Verify' }).click()
    cy.findByText('Proof of address required').should('exist')
    cy.c_closeNotificationHeader()
    cy.reload()
    cy.contains('ID verification passed').should('be.visible')
    cy.contains('a', 'Continue trading').should('be.visible')
  })
})
