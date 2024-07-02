import {
  generateFakeProfileName,
  generateRandomName,
} from '../../../support/helper/utility'
describe('QATEST-4777 Onfido fake profile.', () => {
  beforeEach(() => {
    cy.c_createRealAccount('co')
    cy.c_login()
  })
  it('Should show unwelcome login ID in BO.', () => {
    cy.c_visitResponsive('/account/personal-details', 'small')
    cy.findByTestId('dt_first_name')
      .clear()
      .type(generateRandomName({ fakeProfile: true }))
    cy.findByTestId('dt_last_name')
      .clear()
      .type(generateRandomName({ fakeProfile: true }))
    cy.findByRole('button', { name: 'Submit' }).click()
    cy.get('.notifications-toggle__icon-wrapper').click()
    /* check for notification */
    cy.findByText(
      'Please submit your proof of identity and proof of address to verify your account and continue trading.'
    ).should('be.visible')
    /* Access BO to check Un welcome Login ID status is there */
    cy.c_visitResponsive('/', 'large')
    ccy.c_visitBackOffice({ login: true })
    cy.findByText('Client Management').click()
    cy.findByPlaceholderText('email@domain.com')
      .should('exist')
      .clear()
      .type(Cypress.env('credentials').test.masterUser.ID)
    cy.findByRole('button', { name: /View \/ Edit/i }).click()
    cy.get('.link').eq(1).should('be.visible').click()
    cy.contains('Unwelcome Login ID (no deposits or trades)').should(
      'be.visible'
    )
    cy.contains('fake profile info - pending POI').should('be.visible')
    /*submit poi */
    cy.c_visitResponsive('/account/personal-details', 'small')
    cy.get('.notifications-toggle__icon-wrapper').click()
    cy.findByText('Go to my account settings').click()
    cy.get('select[name="country_input"]').select('Colombia')
    cy.contains('button', 'Next').click()
    cy.findByTestId('first_name')
      .clear()
      .type(generateRandomName({ fakeProfile: false }))
    cy.findByTestId('last_name')
      .clear()
      .type(generateRandomName({ fakeProfile: false }))
    cy.findByTestId('date_of_birth').clear().type('1990-01-01')
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
    cy.c_waitUntilElementIsFound({
      cyLocator: () => cy.findByText('Your proof of identity is verified'),
      timeout: 4000,
      maxRetries: 5,
    })
    cy.findByText('Proof of address required', { timeout: 30000 }).should(
      'exist'
    )
    cy.c_closeNotificationHeader()
    /* submit POA */
    cy.c_visitResponsive('/account/proof-of-address', 'small')
    cy.findByRole('button', { name: 'Save and submit' }).should(
      'not.be.enabled'
    )
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
    /* check no unwelcome notifications are present */
    cy.get('.notifications-toggle__icon-wrapper').click()
    cy.findByText(
      'Please submit your proof of identity and proof of address to verify your account and continue trading.'
    ).should('not.exist')
    /* Check BO again, no Unwelcome Login ID status should be present */
    cy.c_visitResponsive('/', 'large')
    cy.c_visitBackOffice({ login: false })
    cy.findByText('Client Management').click()
    cy.findByPlaceholderText('email@domain.com')
      .should('exist')
      .clear()
      .type(Cypress.env('credentials').test.masterUser.ID)
    cy.findByRole('button', { name: /View \/ Edit/i }).click()
    cy.get('.link').eq(1).should('be.visible').click()
    cy.contains('Unwelcome Login ID (no deposits or trades)').should(
      'not.be.visible'
    )
    cy.contains('fake profile info - pending POI').should('not.exist')
  })
})
