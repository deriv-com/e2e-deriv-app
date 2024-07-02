export {}
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * This command allows visiting a specified path in the application with a set viewport size.
       * The viewport size determines the responsiveness of the visit.
       * It defaults to the 'viewPortSize' set in Cypress environment variables if not specified.
       * @param path The relative URL path to visit.
       * @param size The size of the viewport to simulate ('small', 'medium', or 'large'). Defaults to 'small' size.
       * @example cy.c_visitResponsive('/cashier', 'small') // Visits the '/cashier' path with 'small' viewport size
       * @example cy.c_visitResponsive('/dashboard') // Uses the default size
       */
      c_visitResponsive(path: string, size?: string): void

      /**
       * This command is used for programmatically logging into the application with specified credentials and settings.
       * It navigates to a given endpoint in 'large' screen mode and logs in with the provided user credentials,
       * handling different configurations based on the `app` parameter.
       * @param options An object containing `user` and `app` keys. `user` defaults to 'masterUser', and `app` defaults to an empty string.
       *                `user` specifies the username to log in with, and `app` specifies the application area to navigate to after login.
       * @example cy.c_login() // Uses default 'masterUser' and no specific app
       * @example cy.c_login({ user: 'adminUser' })
       * @example cy.c_login({ app: 'doughflow' })
       * @example cy.c_login({ user: 'adminUser', app: 'doughflow' })
       */
      c_login(options?: { user?: string; app?: string }): void

      /**
       * This command is used for OAuth login to the application programmatically.
       * It navigates to the OAuth URL in 'large' screen mode and handles modal interactions
       * before navigating to the appropriate section of the application based on the `app` parameter.
       * @param app The specific application area to navigate to after login, such as 'wallets', 'doughflow', 'demoonlywallet', or 'onramp'.
       * @example cy.c_doOAuthLogin() will navigate to Tradershub
       * @example cy.c_doOAuthLogin('doughflow')
       */
      c_doOAuthLogin(app: string): void

      /**
       * This command is used to log into the MT5 platform programmatically.
       * It navigates to the MT5 base URL in 'large' screen mode, accepts the initial prompt,
       * and then enters the login and password credentials before clicking the connect button.
       * @example cy.c_mt5login()
       */
      c_mt5login(): void

      /**
       * Custom command to handle rate limit errors by retrying the action after a specified wait time.
       * It will retry for a specified number of times before giving up.
       * @param options An object with retryCount, maxRetries, waitTimeAfterError, retryWaitTime, and isLanguageTest properties.
       * @example cy.c_rateLimit() // will run with default values
       * @example cy.c_rateLimit({ retryCount: 1, maxRetries: 3, waitTimeAfterError: 60000, retryWaitTime: 1000, isLanguageTest: false })
       */
      c_rateLimit(options?: {
        retryCount?: number
        maxRetries?: number
        waitTimeAfterError?: number
        retryWaitTime?: number
        isLanguageTest?: boolean
      }): void

      /**
       * Custom command to check for transfer limits and respond accordingly.
       * It checks for specific transfer limit messages and handles them by clicking on reset or verifying success.
       * @param transferMessage The message to be verified or displayed after a transfer action.
       * @example cy.c_transferLimit('Your transfer is successful!')
       */
      c_transferLimit(transferMessage: string): void

      /**
       * Custom command to select a real account from the options available.
       * It finds and clicks the 'Real' account option.
       * @example cy.c_selectRealAccount()
       */
      c_selectRealAccount(): void

      /**
       * Custom command to select a demo account from the options available.
       * It finds and clicks the 'Demo' account option.
       * @example cy.c_selectDemoAccount()
       */
      c_selectDemoAccount(): void

      /**
       * Custom command to perform email verification by checking for an email related to a specific request type.
       * It retries the email lookup a specified number of times.
       * @param requestType The type of request to check the email for.
       * @param accountEmail The email address to verify.
       * @param options Options for retry logic, including retryCount, maxRetries, and baseUrl.
       * @example cy.c_emailVerification('verification', 'user@example.com')
       * @example cy.c_emailVerification('verification', 'user@example.com', { retryCount: 0, maxRetries: 3 })
       */
      c_emailVerification(
        requestType: string,
        accountEmail: string,
        options?: {
          retryCount?: number
          maxRetries?: number
          baseUrl?: string
        }
      ): void

      /**
       * Custom command to check that the initial loading indicator is not present on the page.
       * @example cy.c_loadingCheck()
       */
      c_loadingCheck(): void

      /**
       * Custom command to retry finding an element until N number of tries
       * @param options Options for locator (Cypress locator or normal CSS locator), timeout between each try (in milliseconds), and maximum retries
       * @example cy.c_waitUntilElementIsFound({cyLocator: () => cy.findByText('Pending action required')})
       * @example cy.c_waitUntilElementIsFound({cyLocator: () => cy.findByText('Pending action required'), maxRetries:4})
       * @example cy.c_waitUntilElementIsFound({cyLocator: () => cy.get(':nth-child(1) > .notification__text-container > .notification__header')})
       * @example cy.c_waitUntilElementIsFound({locator: '.notification:nth-child(1)',maxRetries: 2})
       */
      c_waitUntilElementIsFound(options?: {
        cyLocator?: string
        locator?: string
        retry?: number
        maxRetries?: number
        timeout?: number
      }): void

      /**
       * Create a demo account
       * @param clientData ClientData object containing country_code, password and account type( trading or wallet)
       * @param clientData.country_code Enter the country code (Default = 'id')
       * @param clientData.password Enter the password
       * @param clientData.type Enter the type (Default = 'trading')
       * @example cy.c_createDemoAccount({country_code: 'sz', type: 'wallet'})
       * @example cy.c_createDemoAccount()
       */
      c_createDemoAccount(clientData?: {
        country_code?: string
        password?: string
        type?: string
      }): void
    }
  }
}
