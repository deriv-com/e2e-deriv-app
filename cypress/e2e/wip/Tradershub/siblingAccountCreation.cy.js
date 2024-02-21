import "@testing-library/cypress/add-commands"
describe('QATEST-5797, QATEST-5820', () => {
    beforeEach(() => {
      cy.c_login()
      cy.c_visitResponsive('/appstore/traders-hub', 'large')
    })
it('Create siblings account', () => { 
    
})

})