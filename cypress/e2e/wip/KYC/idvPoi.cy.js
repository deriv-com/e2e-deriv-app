import '@testing-library/cypress/add-commands'

describe('QATEST-23015 - IDV POI Name Mismatch', () => {
    beforeEach(()=> {
        cy.c_login();
        cy.navigate_to_poi(/Republic of QA/i);

    })
    
    it('should return Name mismatch', () => {
        cy.get('input[name="document_type"]').click()
        cy.contains("Passport").click()
        cy.get('input[name="document_number"]').type("1234678");
        cy.contains('button', 'Verify').should('be.disabled');
        cy.get('.dc-checkbox__box').click()
        cy.contains('button', 'Verify').should('be.enabled');
        cy.contains('button', 'Verify').click()
        cy.reload()
        cy.wait(100)
        // making assertions on the expected behavior
        cy.contains(/Your ID is verified/i).should('exist');
    });
});