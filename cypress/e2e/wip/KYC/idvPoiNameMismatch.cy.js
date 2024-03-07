import '@testing-library/cypress/add-commands'

describe('QATEST-23015 - IDV POI Name Mismatch - Mobile view', () => {
    beforeEach(()=> {
        cy.c_login()
        cy.c_navigateToPoiResponsive('Republic of QA')
    })
    
    it('Should return Name mismatch', () => {
        cy.get('select[name="document_type"]').select('Passport')
        cy.findByLabelText('Enter your document number').type('12376678')
        cy.findByTestId('first_name').clear().type('Refuted')
        cy.findByTestId('last_name').clear().type('Name')
        cy.findByTestId('date_of_birth').type('2000-09-20')

        cy.findByRole('button', { name: 'Verify' }).should('be.disabled')
        cy.get('.dc-checkbox__box').click()
        cy.findByRole('button', { name: 'Verify' }).should('be.enabled').click()
        cy.contains("Your documents were submitted successfully").should('be.visible')
        cy.reload()

        cy.contains("Your identity verification failed").should('be.visible')
        cy.contains("The name on your identity document doesn't match your profile.").should('be.visible')

    })
})