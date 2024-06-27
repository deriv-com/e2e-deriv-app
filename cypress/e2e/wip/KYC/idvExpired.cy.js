describe('QATEST-22808 IDV Expired scenario', () => {
  beforeEach(() => {
    cy.c_visitResponsive('/')
    cy.c_createRealAccount('ke')
    cy.c_login()
    cy.c_navigateToPoiResponsive('Kenya')
  })

  it('should return document expired', () => {
    cy.get('select[name="document_type"]').select('Passport')
    cy.findByLabelText('Enter your document number').type('A00000000')
    cy.findByTestId('first_name').clear().type('Joe Doe')
    cy.findByTestId('last_name').clear().type('Leo')
    cy.findByTestId('date_of_birth').type('2000-09-20')
    cy.get('.dc-checkbox__box').click()
    cy.findByRole('button', { name: 'Verify' }).click()
    cy.contains('Your documents were submitted successfully').should(
      'be.visible'
    )
    cy.findByText('Proof of address required', { timeout: 30000 }).should(
      'exist'
    )
    cy.c_closeNotificationHeader()
    cy.reload()
    cy.contains('Your identity document has expired').should('be.visible')
  })
})
