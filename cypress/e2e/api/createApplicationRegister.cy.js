let oldAppId = 0

describe('QATEST - 148419 - Register a New Application / App ID', () => {
  it('configAppId should be different to original env var.', () => {
    cy.c_visitResponsive('/')
    cy.c_createDemoAccount()
    cy.c_login()

    oldAppId = Cypress.env('configAppId')
    cy.log('oldAppId = ' + Cypress.env('configAppId'))
    if (Cypress.env('runFromPR') != 'true') {
      cy.c_createApplicationId()
      cy.log('newAppId = ' + Cypress.env('updatedAppId'))
    }

    if (Cypress.env('runFromPR') != 'true') {
      cy.then(() => {
        const newConfigAppId = Cypress.env('configAppId')
        expect(
          oldAppId,
          'Old app ID should not be equal to the new app ID'
        ).to.not.equal(newConfigAppId)
      })
    } else {
      cy.then(() => {
        const newConfigAppId = Cypress.env('configAppId')
        expect(
          oldAppId,
          'Old app ID should be equal to the new app ID'
        ).to.equal(newConfigAppId)
      })
    }
  })
})
