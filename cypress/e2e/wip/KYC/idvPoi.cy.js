import '@testing-library/cypress/add-commands'

describe('IDV POI submission', () => {
    beforeEach(()=> {
        cy.c_login();
        cy.navigate_to_poi('Ghana');

    })
    
    it('should return Name mismatch', () => {
        cy.get('input[name="document_type"]').click()
        cy.contains("Drivers License").click()
        cy.get('input[name="document_number"]').type("B0000001");
        cy.contains('button', 'Verify').should('be.disabled');
        cy.get('.dc-checkbox__box').click()
        cy.contains('button', 'Verify').should('be.enabled');
        // cy.contains('button', 'Verify').click()
        cy.reload()
        // making assertions on the expected behavior
    });
});