import { generateRandomName } from '../helper/loginUtility'
import { generateCPFNumber } from '../helper/utility'

const BO_URL = `https://${Cypress.env('configServer')}${Cypress.env('qaBOEndpoint')}`

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

Cypress.Commands.add('c_navigateToPoaResponsive', () => {
  cy.c_visitResponsive('/account/proof-of-address', 'small')
  cy.c_closeNotificationHeader()
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

Cypress.Commands.add('c_resetData', () => {
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
  cy.get('input[name="last_name"]')
    .clear()
    .type(generateRandomName())
    .type('{enter}')
})

Cypress.Commands.add('c_verifyAccount', () => {
  const CPFDocumentNumber = generateCPFNumber()
  cy.get('select[name="document_type"]').select('CPF')
  cy.findByLabelText('Enter your document number')
    .type(CPFDocumentNumber)
    .should('have.value', CPFDocumentNumber)
  cy.get('.dc-checkbox__box').click()
  cy.findByRole('button', { name: 'Verify' }).click()
  cy.c_rateLimit({
    waitTimeAfterError: 15000,
    isLanguageTest: true,
    maxRetries: 6,
  })
  cy.c_closeNotificationHeader()
  cy.c_visitResponsive('/account/proof-of-identity', 'small')
  cy.contains('ID verification passed').should('be.visible')
  cy.contains('a', 'Continue trading').should('be.visible')
})
