import { getCurrentDate } from '../../../support/helper/utility'
import {
  generateFakeProfileName,
  generateRandomName,
} from '../../../support/helper/utility'
const CURRENT_DATE = getCurrentDate()
describe('QATEST-4745 Trigger KYC check in different scenarios.', () => {
  beforeEach(() => {
    cy.c_createRealAccount('co')
    cy.c_login()
  })
  it('High risk client, withdrawal should be locked.', () => {
    /* Visit BO */
    cy.c_visitResponsive('/', 'large')
    cy.c_visitBackOffice({ login: true })
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
    /* Check withdrawal lock on FE */
    cy.c_visitResponsive('/cashier/withdrawal', 'small')
    cy.findByText('Withdrawals are locked').should('be.visible')
    cy.findByTestId('dt_empty_state_description').should(
      'have.text',
      'You can only make deposits. Please complete the financial assessment to unlock withdrawals.'
    )
    /* submit FA */
    cy.findByTestId('dt_financial_assessment_link').should('be.visible').click()
    cy.get('select[name="income_source"]').select('Salaried Employee')
    cy.get('select[name="employment_status"]').select('Employed')
    cy.get('select[name="employment_industry"]').select('Construction')
    cy.get('select[name="occupation"]').select('Managers')
    cy.get('select[name="source_of_wealth"]').select('Cash Business')
    cy.get('select[name="education_level"]').select('Tertiary')
    cy.get('select[name="net_income"]').select('$25,000 - $50,000')
    cy.get('select[name="estimated_worth"]').select('$100,000 - $250,000')
    cy.get('select[name="account_turnover"]').select('Less than $25,000')
    cy.contains('button', 'Submit').should('be.enabled').click()
    cy.findByText('Financial assessment submitted successfully').should(
      'be.visible'
    )
    /* Check on withdrawal that only POI and POA are required */
    cy.c_visitResponsive('/cashier/withdrawal', 'small')
    cy.contains(
      'Your account has not been authenticated. Please submit your proof of identity and proof of address to authenticate your account and request for withdrawals.'
    )
    /* submit POI */
    cy.contains('a', 'proof of identity').click()
    cy.get('select[name="country_input"]').select('Colombia')
    cy.contains('button', 'Next').click()
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
    cy.findByText('Your documents were submitted successfully').should(
      'be.visible'
    )
    cy.contains('a.dc-btn--primary', 'Submit proof of address').click()

    /* submit POA */
    cy.get('input[type=file]').selectFile(
      'cypress/fixtures/kyc/testDocument.jpg',
      { force: true }
    )
    cy.findByRole('button', { name: 'Save and submit' })
      .should('be.enabled')
      .click()
    cy.findByText('Your documents were submitted successfully').should(
      'be.visible'
    )
    /* Verify docs from BO */
    cy.c_visitBackOffice({ login: false })
    cy.findByText('Client Management').click()
    cy.findByPlaceholderText('email@domain.com')
      .should('exist')
      .clear()
      .type(Cypress.env('credentials').test.masterUser.ID)
    cy.findByRole('button', { name: /View \/ Edit/i }).click()
    cy.get('.link').eq(1).should('be.visible').click()
    cy.get(
      '#documents_wrapper table tbody tr td input[name^="issue_date_"]'
    ).type(CURRENT_DATE)
    cy.get('#documents_wrapper table tbody tr td input[type="checkbox"]')
      .should('exist')
      .check()
    cy.findByRole('button', { name: /Verify Checked Files/i }).click()
    cy.get('select[name="client_authentication"]')
      .select('Authenticated with scans')
      .type('{enter}')
    /* check FE on withdrawal page no cashier lock is there */
    cy.c_visitResponsive('/cashier/withdrawal', 'small')
    cy.contains('You have no funds in your USD account').should('be.visible')
  })

  it('p2p advertizer, POI/POA should be required to buy/sell.', () => {
    /* Visit cashier page */
    cy.c_visitResponsive('/cashier/', 'small')
    cy.get('#dt_mobile_drawer_toggle').click()
    cy.contains('Cashier').click()
    cy.contains('Deriv P2P').click()
    cy.contains('li', 'My ads').click()
    cy.findByText('Verify your identity and address to use Deriv P2P.').should(
      'be.visible'
    )
    /*submit POI */
    cy.findByText('Upload documents to verify your identity.')
      .should('be.visible')
      .click()
    cy.get('select[name="country_input"]').select('Colombia')
    cy.contains('button', 'Next').click()
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
    cy.findByText('Your documents were submitted successfully').should(
      'be.visible'
    )
    /* Submit POA */
    cy.c_visitResponsive('/account/proof-of-address/', 'small')
    cy.get('input[type=file]').selectFile(
      'cypress/fixtures/kyc/testDocument.jpg',
      { force: true }
    )
    cy.findByRole('button', { name: 'Save and submit' })
      .should('be.enabled')
      .click()
    cy.findByText('Your documents were submitted successfully').should(
      'be.visible'
    )
    /* Visit BO and verify docs */
    cy.c_visitBackOffice({ login: true })
    cy.findByText('Client Management').click()
    cy.findByPlaceholderText('email@domain.com')
      .should('exist')
      .clear()
      .type(Cypress.env('credentials').test.masterUser.ID)
    cy.findByRole('button', { name: /View \/ Edit/i }).click()
    cy.get('.link').eq(1).should('be.visible').click()
    cy.get(
      '#documents_wrapper table tbody tr td input[name^="issue_date_"]'
    ).type(CURRENT_DATE)
    cy.get('#documents_wrapper table tbody tr td input[type="checkbox"]')
      .should('exist')
      .check()
    cy.findByRole('button', { name: /Verify Checked Files/i }).click()
    cy.get('select[name="client_authentication"]')
      .select('Authenticated with scans')
      .type('{enter}')
    /* visit p2p page and check that you are able to create an advertizer */
    cy.c_visitResponsive('/cashier/', 'small')
    cy.get('#dt_mobile_drawer_toggle').click()
    cy.contains('Cashier').click()
    cy.contains('Deriv P2P').click()
    cy.contains('li', 'My ads').click()
    cy.findByText(
      'Looking to buy or sell USD? You can post your own ad for others to respond.'
    ).should('be.visible')
    cy.contains('button', 'Create new ad').click()
    cy.findByLabelText('Your nickname').type(
      generateRandomName({ fakeProfile: false })
    )
    cy.contains('button', 'Confirm').should('be.enabled').click()
    cy.get(
      '.notification.notification--announce[data-testid="dt_default_component"]'
    ).should('be.visible')
  })
  it('Creation of MT5 regulated account, should ask for both POI and POA', () => {
    cy.c_visitResponsive('/', 'small')
    /* check that to create MT5 regulated account, you have to submit POI and POA */
    cy.findByRole('button', { name: 'CFDs' }).click()
    cy.findByTestId('dt_trading-app-card_real_standard')
      .contains('button', 'Get')
      .click()
    cy.findByText('British Virgin Islands').should('be.visible').click()
    cy.get('.dc-checkbox__box').click()
    cy.contains('button', 'Next').click()
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
    cy.get('input[type=file]').selectFile(
      'cypress/fixtures/kyc/testDocument.jpg',
      { force: true }
    )
    cy.findByRole('button', { name: 'Continue' }).click()
    cy.findByTestId('dt_mt5_password').type(
      Cypress.env('credentials').test.mt5User.PSWD
    )
    cy.contains('button', 'Create Deriv MT5 password').click()
    cy.contains('Your Deriv MT5 Standard account is ready.').should(
      'be.visible'
    )
  })
})
