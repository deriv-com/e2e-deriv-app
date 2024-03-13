import '@testing-library/cypress/add-commands'
import { createAccountReal } from '../../../support/accountCreation';

describe('QATEST-23015 - IDV POI Name Mismatch - Mobile view', () => {
    beforeEach(()=> {
        cy.c_login();
        createAccountReal()
        // cy.navigate_to_poi_responsive('Republic of QA');

    })
    
    it('Should return Name mismatch', () => {
        cy.choose_document_type_responsive("Passport")
        cy.fill_data("document_number", "12760978")
        cy.fill_data("first_name", "Refuted")
        cy.fill_data("last_name", "Name")
        cy.fill_date("2000", "9", "20")

        cy.contains('button', 'Verify').should('be.disabled')
        cy.get('.dc-checkbox__box').click()
        cy.contains('button', 'Verify').should('be.enabled')
        cy.contains('button', 'Verify').click()
        cy.wait(1000)
        cy.reload()

        cy.contains(/Your identity verification failed/).should('be.visible')
        cy.contains("The name on your identity document doesn't match your profile.").should('be.visible')

    }); 
});