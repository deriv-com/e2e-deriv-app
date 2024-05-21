Cypress.Commands.add('c_navigateToPoi', (country) => {
  cy.get('a[href="/account/personal-details"]').click()
  cy.findByRole('link', { name: 'Proof of identity' }).click()
  cy.findByLabel('Country').click()
  cy.findByText(country).click()
  cy.contains(country).click()
  cy.contains('button', 'Next').click()
})

Cypress.Commands.add('c_navigateToPoiResponsive', (country, options = {}) => {
  const { runFor = '' } = options
  if (runFor == 'p2p') {
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
    cy.c_skipPasskeysV2()
  }
  cy.c_visitResponsive('/account/proof-of-identity', 'small')
  cy.c_closeNotificationHeader()
  cy.get('select[name="country_input"]').select(country)
  cy.contains('button', 'Next').click()
})

Cypress.Commands.add('c_submitIdv', () => {
  cy.get('select[name="document_type"]').select('Passport')
  cy.findByLabelText('Enter your document number').type('G0000001')
  cy.get('.dc-checkbox__box').click()
  cy.findByRole('button', { name: 'Verify' }).click()
})

Cypress.Commands.add('c_onfidoSecondRun', (country) => {
  cy.get('select[name="country_input"]').select(country)
  cy.findByRole('button', { name: 'Next' }).click()
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
