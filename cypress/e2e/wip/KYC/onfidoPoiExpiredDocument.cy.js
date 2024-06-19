const BO_URL = `https://${Cypress.env('configServer')}${Cypress.env('qaBOEndpoint')}`
describe('QATEST-4760 Onfido Expired document.', () => {
  beforeEach(() => {
    cy.c_createRealAccount('co')
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
    //cy.findByText('Account verification required').should('be.visible')
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
    cy.get('select[name="client_aml_risk_classification"]')
      .select('High')
      .type('{enter}')
    /* cashier locks in BO */
    cy.contains('Withdrawal Locked').should('not.be.visible')
    cy.contains('Cashier Locked').should('not.be.visible')
    /* Check cashier lock on FE */
    cy.c_visitResponsive('/cashier/deposit', 'small')
    cy.findByText('Cashier is locked').should('not.be.visible')
    cy.findByText(
      'The identification documents you submitted have expired. Please submit valid identity documents to unlock Cashier.'
    ).should('be.visible')
  })
})
