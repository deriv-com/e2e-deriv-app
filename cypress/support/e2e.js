import '@testing-library/cypress/add-commands'
import 'cypress-iframe'
import 'cypress-mailisk'
import 'cypress-xpath'
import jsQR from 'jsqr'
import './commands/index'
// Expose jsQR globally
Cypress.jsQR = jsQR

before(() => {
  if (Cypress.env('runFromPR') != 'true') return

  cy.task('getPRAppId').then((id) => {
    if (!id) {
      cy.c_createApplicationId().then(() => {
        cy.task('setAppId', Cypress.env('configAppId'))
      })
    } else {
      Cypress.env('configAppId', id)
    }

    Cypress.env('updatedAppId', Cypress.env('configAppId'))
    Cypress.env('stdConfigAppId', Cypress.env('configAppId'))
    Cypress.prevAppId = Cypress.env('configAppId')

    Cypress.config('baseUrl', Cypress.env('appRegisterUrl'))
    Cypress.env('oAuthUrl', '<empty>')

    cy.log('AppId value before tests = ' + Cypress.env('configAppId'))
  })
})
