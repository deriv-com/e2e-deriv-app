import '@testing-library/cypress/add-commands'

describe('QATEST-22037 IDV verified by Smile Identity provider', () => {
    beforeEach(()=> {
        cy.c_login();
        cy.c_navigateToPOIResponsive('Republic of QA')
    

    })
    
    it('Should Return IDV Verified', () => {
        cy.get('select[name="document_type"]').select('Passport')
        cy.findByLabelText('Enter your document number').type('12376678')
        cy.findByTestId('first_name').clear().type('Verifiede')
        cy.findByTestId('last_name').clear().type('Namee')
        cy.findByTestId('date_of_birth').type('2000-01-01')
        cy.get('.dc-checkbox__box').click()
        cy.findByRole('button', { name: 'Verify' }).click()
        cy.contains('ID verification passed').should('be.visible')
        cy.contains('a','Continue trading').should('be.visible')
        
    }); 
});