const BO_URL = `https://${Cypress.env('configServer')}${Cypress.env('qaBOEndpoint')}`
describe('QATEST-4785 High risk onfido supported country.', () => {
  beforeEach(() => {
    cy.c_createCRAccount({ country_code: 'co' })
    cy.c_login()
    cy.c_navigateToPoiResponsive('Colombia')
  })

  it('Should ask for FA upon MT5 regulated account creation.', () => {
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
    /* Visit BO */
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
    cy.get('select[name="client_aml_risk_classification"]')
      .select('High')
      .type('{enter}')
    /* No cashier lock in BO */
    cy.get('#card__content table tbody tr td b Withdrawal Locked').should(
      'not.exist'
    )
    /* Check no cashier lock on FE */
    cy.c_visitResponsive('/cashier/deposit', 'small')
    cy.findByText('Deposit via bank wire, credit card, and e-wallet').should(
      'be.visible'
    )
    /* 
      Check that upon creating mt5 regulated, 
      should ask for POA only 
      Should ask for FA 
      */
    cy.c_visitResponsive('/', 'small')
    cy.findByText('Proof of address required', { timeout: 30000 }).should(
      'exist'
    )
    cy.c_closeNotificationHeader()
    cy.findByRole('button', { name: 'CFDs' }).click()
    cy.findByTestId('dt_trading-app-card_real_standard')
      .contains('button', 'Get')
      .click()
    cy.findByText('British Virgin Islands').should('be.visible').click()
    cy.get('.dc-checkbox__box').click()
    cy.findByTestId('dt_modal_footer').contains('button', 'Next').click()
    cy.get('input[type=file]').selectFile(
      'cypress/fixtures/kyc/testDocument.jpg',
      { force: true }
    )
    cy.findByRole('button', { name: 'Continue' }).click()
    cy.findByTestId('dt_mt5_password').type(
      Cypress.env('credentials').test.mt5User.PSWD
    )
    cy.contains('button', 'Create Deriv MT5 password').click()
    /* assertion to check if FA is asked upon creating MT5 account */
    cy.findByText('Please complete your financial assessment.').should(
      'be.visible'
    )
  })
})
