const BO_URL = `https://${Cypress.env('configServer')}${Cypress.env('qaBOEndpoint')}`
describe('QATEST-4760 Onfido Expired document.', () => {
  beforeEach(() => {
    cy.c_createCRAccount({ country_code: 'co' })
    cy.c_login()
    cy.c_navigateToPoiResponsive('Colombia')
  })
  it('POI resubmission option should be dislayed.', () => {
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
    cy.c_closeNotificationHeader()
    cy.c_waitUntilElementIsFound({
      cyLocator: () => cy.findByText('Your proof of identity is verified'),
      timeout: 4000,
      maxRetries: 5,
    })
    /* Access BO */
    cy.c_visitResponsive('/', 'large')
    cy.visit(BO_URL)
    cy.findByText('Please login.').click()
    cy.findByText('Client Management').click()
    cy.findByPlaceholderText('email@domain.com')
      .should('exist')
      .clear()
      .type(Cypress.env('credentials').test.masterUser.ID)
    cy.findByRole('button', { name: /View \/ Edit/i }).click()
    cy.get('.link').eq(1).should('be.visible').click()
    cy.get(
      '#documents_wrapper table tbody tr td input[name^="expiration_date_"]'
    )
      .clear()
      .type('2021-09-20')
    cy.get('input[value="Save client details"]').last().click()
    /* Check no cashier locks in BO */
    cy.get('#card__content table tbody tr td b Withdrawal Locked').should(
      'not.exist'
    )
    /* Check no cashier lock on FE */
    cy.c_visitResponsive('/cashier/deposit', 'small')
    cy.findByText('Deposit via bank wire, credit card, and e-wallet').should(
      'be.visible'
    )
    /* Check on POI page */
    cy.c_visitResponsive('/account/proof-of-identity', 'small')
    cy.contains('Your document has expired.').should('be.visible')
    cy.c_closeNotificationHeader()
  })
})
