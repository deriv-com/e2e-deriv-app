import { generateRandomName } from '../helper/loginUtility'

Cypress.Commands.add('c_navigateToPoi', (country) => {
  cy.get('a[href="/account/personal-details"]').click()
  cy.findByRole('link', { name: 'Proof of identity' }).click()
  cy.findByLabel('Country').click()
  cy.findByText(country).click()
  cy.contains(country).click()
  cy.contains('button', 'Next').click()
})

Cypress.Commands.add('c_navigateToPoiResponsive', (country) => {
  cy.c_visitResponsive('/account/proof-of-identity', 'small')
  cy.get('select[name="country_input"]').select(country)
  cy.contains('button', 'Next').click()
})

Cypress.Commands.add('c_submitIdv', () => {
  cy.get('select[name="document_type"]').select('Passport')
  cy.findByLabelText('Enter your document number').type('12345678')
  cy.findByTestId('first_name').clear().type('Refuted')
  cy.findByTestId('last_name')
    .clear()
    .type(`${generateRandomName()}` + ' ' + 'Rejected')
  cy.findByTestId('date_of_birth').type('2000-09-20')
  cy.get('.dc-checkbox__box').click()
  cy.findByRole('button', { name: 'Verify' }).click()
})

Cypress.Commands.add('c_onfidoSecondRun', () => {
  cy.get('select[name="country_input"]').select('Colombia')
  cy.contains('button', 'Next').click()
  cy.get('.dc-checkbox__box').click()
  cy.findByText('Passport').click()
  cy.findByText('or upload photo – no scans or photocopies').click()
  cy.get('input[type=file]').selectFile(
    'cypress/fixtures/kyc/testDriversLicense.jpeg',
    { force: true }
  )
  cy.findByText('Confirm').click()
  cy.findByText('Continue').click()
  cy.get('.onfido-sdk-ui-Camera-btn').click()
  cy.findByText('Confirm').click()
})
