import '@testing-library/cypress/add-commands'

describe('QATEST-22853 IDV Document Rejected by Smile Identity provider', () => {
  beforeEach(() => {
    cy.c_visitResponsive('/')
    cy.c_createRealAccount('gh')
    cy.c_login()
    cy.c_navigateToPoiResponsive('Ghana')
  })

  it('Should return Document Rejected', () => {
    cy.get('select[name="document_type"]').select('Passport')
    cy.findByLabelText('Enter your document number').type('G0000001')
    cy.findByTestId('first_name').clear().type('adele')
    cy.findByTestId('last_name').clear().type('Jojo')
    cy.findByTestId('date_of_birth').type('2000-09-20')

    cy.findByRole('button', { name: 'Verify' }).should('be.disabled')
    cy.get('.dc-checkbox__box').click()
    cy.findByRole('button', { name: 'Verify' }).should('be.enabled').click()
    cy.findByText('Your documents were submitted successfully').should(
      'be.visible'
    )
    cy.findByText('Proof of address required', { timeout: 3000 }).should(
      'be.visible'
    )
    cy.c_closeNotificationHeader()
    cy.reload()
    cy.findByText(
      'We were unable to verify the identity document with the details provided.'
    ).should('be.visible')
  })
})
