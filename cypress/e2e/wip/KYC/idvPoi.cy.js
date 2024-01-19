describe('IDV POI submission', () => {
    beforeEach(() => {
        cy.c_visitResponsive("/endpoint", "large")
        cy.log("server: " + Cypress.env("configServer"))
        cy.log("appId: " + Cypress.env("configAppId"))
        localStorage.setItem("config.server_url", Cypress.env("configServer"))
        localStorage.setItem("config.app_id", Cypress.env("configAppId"))
        cy.go_to_login_page();

        cy.get('#txtEmail').type(Cypress.env("loginEmail"));
        cy.get('#txtPass').type(Cypress.env("loginPassword"));
        cy.get('.button').contains('Log in').click()
        cy.loading_check();
      })
    
    it('should return Name mismatch', () => {
        cy.log('Test to go here')
    });
});