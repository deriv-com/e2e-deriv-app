describe('QATEST-23015 - IDV POI Name Mismatch - Mobile view', () => {
  beforeEach(() => {
    cy.c_createCRAccount({ country_code: 'ke' })
    cy.c_login()
    cy.findByTestId('dt_traders_hub').should('be.visible')
    cy.c_navigateToPoiResponsive('Kenya')
  })

  it('Should return Name mismatch', () => {
    cy.get('select[name="document_type"]').select('National ID Number')
    cy.findByLabelText('Enter your document number').type('00000000')
    cy.findByTestId('date_of_birth').type('2000-09-20')

    cy.findByRole('button', { name: 'Verify' }).should('be.disabled')
    cy.get('.dc-checkbox__box').click()
    cy.findByRole('button', { name: 'Verify' }).should('be.enabled').click()
    cy.contains('Your documents were submitted successfully').should(
      'be.visible'
    )
    cy.findByText('Proof of address required', { timeout: 30000 }).should(
      'exist'
    )
    cy.c_closeNotificationHeader()
    cy.reload()

    cy.contains('Your identity verification failed because:').should(
      'be.visible'
    )
    cy.contains(
      "The name on your identity document doesn't match your profile."
    ).should('be.visible')
  })
})
