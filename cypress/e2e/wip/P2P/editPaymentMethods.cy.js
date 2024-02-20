import '@testing-library/cypress/add-commands'

describe("P2P - Edit Payment Methods", () => {
    beforeEach(() => {
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'small')
    })
    
    it('should be able to edit the existing payment methods', () => {

    })
})