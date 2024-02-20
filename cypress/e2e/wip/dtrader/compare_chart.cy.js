import '@testing-library/cypress/add-commands'
import '../../../support/commands'


describe('Make sure chart is updating', () => {
    beforeEach(() => {
        cy.c_visitResponsive("", "large")
        localStorage.setItem("config.server_url", Cypress.env("configServer"))
        localStorage.setItem("config.app_id", Cypress.env("configAppId"))
    })

    it('should update the line chart', () => {
        cy.wait(15000) //TODO dont hardcode long wait time
        cy.compareElementScreenshots('.flutter-chart', 'initial-state', 'updated-state', 'diff-state');
      });


})