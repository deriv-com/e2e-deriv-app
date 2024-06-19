const BO_URL = `https://${Cypress.env('configServer')}${Cypress.env('qaBOEndpoint')}`
describe('QATEST-4880 Types of cashier lock when POI expired - MF account', () => {
  beforeEach(() => {
    cy.c_createRealAccount('aq')
    cy.c_login()
    cy.findByTestId('dt_traders_hub').should('be.visible')
    cy.c_navigateToPoiResponsive('Spain')
  })

  it('Should have cashier lock when POI expire for MF', () => {
    /* Submit POI */
    cy.findByTestId('date_of_birth').type('1990-01-01')
    cy.findByText('Choose document').should('be.visible')
    cy.get('.dc-checkbox__box').click()
    cy.findByText('Passport').click()
    cy.findByText('Submit passport photo pages').should('be.visible')
    cy.findByText('or upload photo – no scans or photocopies').click()
    cy.findByText('Upload passport photo page').should('be.visible')
    cy.get('input[type=file]').selectFile(
      'cypress/fixtures/kyc/testDriversLicense.jpeg',
      { force: true }
    )
    cy.findByText('Confirm').click()
    cy.findByText('Continue').click()
    cy.findByText('Take a selfie').should('be.visible')
    cy.get('.onfido-sdk-ui-Camera-btn').click()
    cy.findByText('Confirm').click()
  })
})
