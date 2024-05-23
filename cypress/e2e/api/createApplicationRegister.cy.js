import '@testing-library/cypress/add-commands'

describe('QATEST - 148419 - Register a New Application / App ID', () => {
  beforeEach(() => {
    cy.log('<prevAppId - beforeEach> ' + Cypress.env('setupComplete'))
    if (!Cypress.env('setupComplete')) {
      if (Cypress.env('runFromPR')) {
        cy.c_createApplicationId()
      }

      Cypress.env('setupComplete', true) // Flag to indicate setup is done
    }
    cy.c_login()
  })

  it('updateAppId should be incremented. ', () => {
    cy.log('<Test 1> ' + Cypress.env('setupComplete'))
  })

  it('updateAppId should NOT be incremented. ', () => {
    cy.log('<Test 2> ' + Cypress.env('setupComplete'))
  })
})
