describe('IDV POI submission', () => {
    // before(() => {
    //     cy.c_visitResponsive("/endpoint", "large")
    //     cy.log("server: " + Cypress.env("configServer"))
    //     cy.log("appId: " + Cypress.env("configAppId"))
    //     localStorage.setItem("config.server_url", Cypress.env("configServer"))
    //     localStorage.setItem("config.app_id", Cypress.env("configAppId"))
    //     cy.get('#dt_login_button').click();
    //     cy.get('#txtEmail').type(Cypress.env("loginEmail"));
    //     cy.get('#txtPass').type(Cypress.env("loginPassword"));
    //     cy.get('.button').contains('Log in').click()
    //     // cy.wait(30000)    
    //     cy.get('#btnGrant').contains('Authorise this app').click()
    //     cy.visit('https://staging-app.deriv.com/')
        
    // })

    beforeEach(()=> {   
        cy.viewport(1280, 720);
        localStorage.setItem("config.server_url", Cypress.env("configServer"))
        localStorage.setItem("config.app_id", Cypress.env("configAppId"))
        cy.visit('https://qa10.deriv.dev/oauth2/authorize?app_id=1007&l=EN&signup_device=desktop&date_first_contact=2024-01-23&brand=deriv')
        cy.get('#txtEmail').type(Cypress.env("loginEmail"));
        cy.get('#txtPass').type(Cypress.env("loginPassword"));
        cy.contains('button', 'Log in').click();

        cy.get('a[href="/account/personal-details"]').click()
        cy.get('a[href="/account/proof-of-identity"]').click()
        cy.get('input[name="country_input"]').click()
        cy.get('input[name="country_input"]').type("Gh");
        cy.contains('Ghana').click()
        cy.contains('button', 'Next').click()

    })
    
    it('should return Name mismatch', () => {
    });
});