import './commands/index'
import 'cypress-mailisk'
import 'cypress-iframe'
import 'cypress-xpath'
import jsQR from 'jsqr'
// Expose jsQR globally
Cypress.jsQR = jsQR

before(() => {
  // Code to run once before all tests
  if (!Cypress.env('setupComplete')) {
    if (Cypress.env('runFromPR')) {
      cy.c_createApplicationId()
    }

    Cypress.env('setupComplete', true) // Flag to indicate setup is done
  }
})
