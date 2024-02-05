import '@testing-library/cypress/add-commands'

describe('IDV POI submission', () => {
    beforeEach(()=> {
        cy.c_login();
        cy.navigate_to_poi('Ghana');

    })
    
    it('should return Name mismatch', () => {
    });
});