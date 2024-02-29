import '@testing-library/cypress/add-commands'

describe('QATEST-23015 - IDV POI Name Mismatch - Mobile view', () => {
    beforeEach(()=> {
        cy.c_login();
        cy.navigate_to_poi_responsive('Republic of QA');
    })
    
    it('Should return Name mismatch', () => {
        cy.choose_document_type_responsive("Passport")
        cy.findByLabelText('Enter your document number').type('12376678');
        cy.fill_data("first_name", "Refuted")
        cy.fill_data("last_name", "Name")
        cy.fill_date("2000", "09", "20")

        cy.findByRole('button', { name: 'Verify' }).should('be.disabled')
        cy.get('.dc-checkbox__box').click()
        cy.findByRole('button', { name: 'Verify' }).should('be.enabled')
        cy.findByRole('button', { name: 'Verify' }).click()
        cy.reload()

        cy.contains(/Your identity verification failed/).should('be.visible')
        cy.contains("The name on your identity document doesn't match your profile.").should('be.visible')

    }); 
});