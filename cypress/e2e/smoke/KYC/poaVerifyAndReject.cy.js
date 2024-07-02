import { getCurrentDate } from '../../../support/helper/utility'

const CURRENT_DATE = getCurrentDate()

describe('QATEST-4835 POA Verified/Rejected', () => {
  beforeEach(() => {
    cy.c_createCRAccount()
    cy.c_login()
    cy.c_navigateToPoaResponsive()
  })

  it('Should show Verified message when POA is verified', () => {
    /* Submit POA */
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
    cy.c_closeNotificationHeader()

    /* Visit BO */
    cy.c_visitResponsive('/', 'large')
    cy.c_visitBackOffice()
    cy.findByText('Client Management').click()
    cy.findByPlaceholderText('email@domain.com')
      .should('exist')
      .clear()
      .type(Cypress.env('credentials').test.masterUser.ID)
    cy.findByRole('button', { name: /View \/ Edit/i }).click()
    cy.get('.link').eq(1).should('be.visible').click()

    /* Rejecting POA from BO */
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

    /* Back to Deriv to make final assertions */
    cy.c_visitResponsive('/account/proof-of-address', 'small')
    cy.contains('Your proof of address is verified').should('be.visible')
    cy.c_closeNotificationHeader()
  })

  it('Should show Failure message when POA is rejected', () => {
    /* Submit POA */
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
    cy.c_closeNotificationHeader()

    /* Visit BO */
    cy.c_visitResponsive('/', 'large')
    cy.c_visitBackOffice()
    cy.findByText('Client Management').click()
    cy.findByPlaceholderText('email@domain.com')
      .should('exist')
      .clear()
      .type(Cypress.env('credentials').test.masterUser.ID)
    cy.findByRole('button', { name: /View \/ Edit/i }).click()
    cy.get('.link').eq(1).should('be.visible').click()

    /* Rejecting POA from BO */
    cy.get(
      '#documents_wrapper table tbody tr td input[name^="issue_date_"]'
    ).type(CURRENT_DATE)
    cy.get('#documents_wrapper table tbody tr td input[type="checkbox"]')
      .should('exist')
      .check()
    cy.findByRole('button', { name: /Reject Checked Files/i }).click()
    cy.get('select[name="client_authentication"]')
      .select('Needs Action')
      .type('{enter}')

    /* Back to Deriv to make final assertions */
    cy.c_visitResponsive('/account/proof-of-address', 'small')
    cy.contains('We could not verify your proof of address').should(
      'be.visible'
    )
    cy.findByRole('button', { name: 'Resubmit' }).should('be.visible')
    cy.c_closeNotificationHeader()
  })
})
