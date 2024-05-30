import '@testing-library/cypress/add-commands'
import { getCurrentDate } from '../../../support/helper/utility'

const BO_URL = `https://${Cypress.env('configServer')}/d/backoffice/login.cgi`
const CURRENT_DATE = getCurrentDate()

describe('QATEST-4835 POA Reject', () => {
  beforeEach(() => {
    // cy.c_visitResponsive('/')
    // cy.c_createRealAccount()
    // cy.c_login()
    // cy.c_navigateToPoaResponsive()
  })

  it('Should show POA page when POA is rejected', () => {
    // cy.findByRole('button', { name: 'Save and submit' }).should('not.be.enabled')

    // cy.get('input[type=file]').selectFile(
    //   'cypress/fixtures/kyc/testDocument.jpg',
    //   { force: true }
    // )

    // cy.findByRole('button', { name: 'Save and submit' }).should('be.enabled').click()

    // cy.findByText('Your documents were submitted successfully').should('be.visible')
    // cy.c_closeNotificationHeader()

    // Visit BO
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

    // rejecting POA from BO
    cy.get('#documents_wrapper table tbody tr td input[type="text"]')
    cy.get('#documents_wrapper table tbody tr td input[type="checkbox"]')
      .should('exist')
      .check()
    cy.findByRole('button', { name: /reject_checked_documents/i }).click()
    cy.get('select[name="client_authentication"]')
      .select('Needs Action')
      .type('{enter}')

    // cy.c_visitResponsive('/account/proof-of-address', 'small')
  })
})
