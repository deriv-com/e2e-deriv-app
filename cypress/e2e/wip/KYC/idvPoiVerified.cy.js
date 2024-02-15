import '@testing-library/cypress/add-commands'

describe('QATEST-22037 IDV verified by Smile Identity provider', () => {
    beforeEach(()=> {
        cy.c_login();
        cy.navigate_to_poi('Ghana');

    })
    
    it('Should Return IDV Verified', () => {
        cy.get('input[name="document_type"]').click()
        cy.contains("Social Security and National Insurance Trust (SSNIT)").click()
        cy.get('input[name="document_number"]').type("C000000000000")
        cy.get('input[name="first_name"').clear().type("Doe Joe")
        cy.get('input[name="last_name"').clear().type("Leo")
        cy.get('input[name="date_of_birth"').click()
        cy.get('span[data-year="2000"]').click()
        cy.get('span[data-month="8"]').click()
       
        cy.get('span[data-date="2000-09-20"]').click()
        cy.contains('button', 'Verify').should('be.disabled')

        cy.get('.dc-checkbox__box').click()
        cy.contains('button', 'Verify').should('be.enabled')
        cy.contains('button', 'Verify').click()
        cy.wait(5000)
        cy.reload()

        cy.contains('ID verification passed').should('be.visible')
        cy.contains('a','Continue trading').should('be.visible')
    }); 
});