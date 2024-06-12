describe('QATEST-23042 IDV DOB Mismatch by Smile Identity provider', () => {
  beforeEach(() => {
    cy.c_visitResponsive('/')
    cy.c_createRealAccount('gh')
    cy.c_login()
    cy.c_navigateToPoiResponsive('Ghana')
  })

  it('Should return Date of birth mismatch', () => {
    cy.get('select[name="document_type"]').select(
      'Social Security and National Insurance Trust (SSNIT)'
    )
    cy.findByLabelText('Enter your SSNIT number').type('C000000000000')
    cy.findByTestId('first_name').clear().type('Doe Joe')
    cy.findByTestId('last_name').clear().type('Leo')
    cy.findByTestId('date_of_birth').type('1991-08-23')

    cy.findByRole('button', { name: 'Verify' }).should('be.disabled')
    cy.get('.dc-checkbox__box').click()
    cy.findByRole('button', { name: 'Verify' }).should('be.enabled').click()
    cy.findByText('Your documents were submitted successfully').should(
      'be.visible'
    )
    cy.findByText('Proof of address required', { timeout: 30000 }).should(
      'be.visible'
    )
    cy.c_closeNotificationHeader()
    cy.reload()
    cy.findByText('Your identity verification failed because:').should(
      'be.visible'
    )
  })
})
