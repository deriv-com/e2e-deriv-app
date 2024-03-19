import '@testing-library/cypress/add-commands'

describe('QATEST-22853 IDV Document Rejected by Smile Identity provider', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_navigateToPoiResponsive('Ghana')
  })

  it('Should return Document Rejected', () => {
    cy.get('select[name="document_type"]').select('Passport')
    cy.findByLabelText('Enter your document number').type('G0000001')
    cy.findByTestId('first_name').clear().type('Joe Doe')
    cy.findByTestId('last_name').clear().type('Leo')
    cy.findByTestId('date_of_birth').type('2000-09-20')

    cy.findByRole('button', { name: 'Verify' }).should('be.disabled')
    cy.get('.dc-checkbox__box').click()
    cy.findByRole('button', { name: 'Verify' }).should('be.enabled').click()
    cy.contains("Your documents were submitted successfully").should('be.visible')
    cy.findByText("Proof of address required").should('exist')
    cy.reload()

    cy.contains("Your identity verification failed").should('be.visible')
    cy.contains("We are un able to verify the documents you submitted.").should('be.visible')

})
})