import '@testing-library/cypress/add-commands'

describe('QATEST-22853 Onfido (2 attempts) failed clients are redirected to manual upload', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_navigateToPoiResponsive('Colombia')
  })

  it('Onfido should fail twice and then manual upload screen should be displayed', () => {
    cy.get('.dc-checkbox__box').click()
    cy.findByText('Choose document').should('be.visible')
    cy.findByText('Passport').click()
    cy.findByText('Submit passport photo pages').should('be.visible')
    cy.findByText('or upload photo – no scans or photocopies').click()
    cy.findByText('Upload passport photo page').should('be.visible')
    cy.get('input[type=file]').selectFile(
      'cypress/fixtures/kyc/testDriversLicense.jpeg',
      { force: true }
    )
    cy.findByText('Confirm').click()
  })
})
