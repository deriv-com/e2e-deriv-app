import '@testing-library/cypress/add-commands'

describe('QATEST-23015 - IDV POI Name Mismatch - Mobile view', () => {
  beforeEach(() => {
    cy.c_visitResponsive('/')
    cy.c_createRealAccount('gh')
    cy.c_login()
    cy.c_navigateToPoiResponsive('Ghana')
  })

  it('Should return Name mismatch', () => {
    cy.get('select[name="document_type"]').select(
      'Social Security and National Insurance Trust (SSNIT)'
    )
    cy.findByLabelText('Enter your SSNIT number').type('C000000000000')
    cy.findByTestId('first_name').clear().type('Test')
    cy.findByTestId('last_name').clear().type('Name')
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

    cy.contains('Your identity verification failed').should('be.visible')
    cy.contains(
      "The name on your identity document doesn't match your profile."
    ).should('be.visible')
  })
})
