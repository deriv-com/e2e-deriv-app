declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * This command is used to visit a path in the application in multiple
       * responsive modes such as 'large' or 'medium' or 'samll'
       * @param path
       * @param size
       * @example cy.c_visitResponsive('path','small')
       */
      c_visitResponsive(path: String, size: String)

      /**
       * This command is used to login to the application pragmatically
       * instead of going to the UI
       * @param app
       * @example cy.c_login()
       * @example cy.c_login('appName')
       */
      c_login(app: String)

      /**
       * This command is used to do oAuth login to the application
       * pragmatically instead of going to the UI
       * @param app
       * @example cy.doOAuthLogin()
       * @example cy.doOAuthLogin('appName')
       */
      c_doOAuthLogin(app: String)
    }
  }
}
