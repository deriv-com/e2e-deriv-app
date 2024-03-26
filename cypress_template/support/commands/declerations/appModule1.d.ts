import { param } from 'cypress/types/jquery'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * To verify the content on the withdrawal page before and after request is sent
       * @param state
       * 'beforeRequest' || 'afterRequest'
       * @example cy.c_verifycontentWithdrawalPage('beforeRequest')
       * @example cy.c_verifycontentWithdrawalPage('afterRequest')
       */
      c_verifycontentWithdrawalPage(state: String)
    }
  }
}
