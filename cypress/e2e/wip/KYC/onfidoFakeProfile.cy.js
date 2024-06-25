import { generateFakeProfileName } from '../../../support/helper/utility'

const BO_URL = `https://${Cypress.env('configServer')}${Cypress.env('qaBOEndpoint')}`
describe('QATEST-4777 Onfido fake profile.', () => {
  beforeEach(() => {
    cy.c_createRealAccount('co')
    cy.c_login()
  })
  it('Should show unwelcome login ID in BO.', () => {
    cy.c_visitResponsive('/account/personal-details', 'small')
    cy.findByTestId('dt_first_name').clear().type(generateFakeProfileName())
    cy.findByTestId('dt_last_name').clear().type(generateFakeProfileName())
    cy.findByRole('button', { name: 'Submit' }).click()
    cy.get('.notifications-toggle__icon-wrapper').click()
    cy.findByText(
      'Please submit your proof of identity and proof of address to verify your account and continue trading.'
    ).should('be.visible')
    /* check for notification */

    /* Access BO */
    // cy.c_visitResponsive('/', 'large')
    // cy.visit(BO_URL)
    // cy.findByText('Please login.').click()
    // cy.findByText('Client Management').click()
    // cy.findByPlaceholderText('email@domain.com')
    //   .should('exist')
    //   .clear()
    //   .type(Cypress.env('credentials').test.masterUser.ID)
    // cy.findByRole('button', { name: /View \/ Edit/i }).click()
    // cy.get('.link').eq(1).should('be.visible').click()
    // cy.contains('Unwelcome Login ID (no deposits or trades)').should(
    //   'be.visible'
    // )
    // cy.contains('fake profile info - pending POI').should('be.visible')
    // /*submit poi */
    //cy.findByRole('button', { name: 'Go to my account settings' }).click()
    //cy.findByText('Go to my account settings').click()
    // cy.findByTestId('dt_first_name').clear().type(generateRandomName())
    // cy.findByTestId('dt_last_name').clear().type(generateRandomName())
    // cy.findByTestId('date_of_birth').type('1990-01-01')
    // cy.findByText('Choose document').should('be.visible')
    // cy.get('.dc-checkbox__box').click()
    // cy.findByText('Passport').click()
    // cy.findByText('Submit passport photo pages').should('be.visible')
    // cy.findByText('or upload photo – no scans or photocopies').click()
    // cy.findByText('Upload passport photo page').should('be.visible')
    // cy.get('input[type=file]').selectFile(
    //   'cypress/fixtures/kyc/testDriversLicense.jpeg',
    //   { force: true }
    // )
    // cy.findByText('Confirm').click()
    // cy.findByText('Continue').click()
    // cy.findByText('Take a selfie').should('be.visible')
    // cy.get('.onfido-sdk-ui-Camera-btn').click()
    // cy.findByText('Confirm').click()
  })
})
