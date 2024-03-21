import { param } from 'cypress/types/jquery'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * This command is used to set the server url and the app Id
       * @param serverUrl
       * @param appId
       * @example
       * cy.c_setServerUrlAndAppId('www.example.com','0000')
       */
      c_setServerUrlAndAppId(serverUrl: URL, appId: String)

      /**
       * This command takes the element from the previous command and
       * then replaces the target  with '_self' through which you can
       * open the link in the same tab
       * @param locator
       * @example
       * cy.get('button').c_clickToOpenInSamePage()
       */
      c_clickToOpenInSamePage(locator: Subject)

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

      /**
       * This command waits for teh loading element not to exist so
       * that we never fail a test due to page not loading completely
       * please use only where the loader is displayed
       * @example cy.c_waitForLoader()
       */
      c_waitForLoader()
    }
  }
}
