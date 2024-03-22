declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Description of the command comes here
       * @param abc
       * @param def
       * @example cy.c_customCommand('path','small')
       */
      c_customCommand(abc: String, def: String)
    }
  }
}
