import '@testing-library/cypress/add-commands'

describe('QATEST-123731 - IDV (2 attempts) and Onfido (1 attempt) failed clients are redirected to manual upload', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_navigateToPoiResponsive('Republic of QA')
  })

  it('IDV (2 attempts) and Onfido (1 attempt) failed clients should be redirected to manual upload', () => {
    // IDV flow
    cy.c_submitIdv()
    cy.contains('Your documents were submitted successfully').should(
      'be.visible'
    )
    cy.findByText('Proof of address required').should('exist')
    cy.reload()

    cy.contains('Your identity verification failed').should('be.visible')
    cy.contains(
      'We were unable to verify the identity document with the details provided.'
    ).should('be.visible')

    cy.findByText('Proof of address required').should('exist')
    cy.c_closeNotificationHeader()
    cy.get('select[name="country_input"]').select('Republic of QA')
    cy.contains('button', 'Next').click()

    cy.c_submitIdv()

    cy.contains(
      'We were unable to verify your ID with the details you provided. Please upload your identity document.'
    ).should('be.visible')
    cy.c_closeNotificationHeader()
    // Onfido flow
    cy.findByRole('button', { name: 'Upload identity document' }).click()
    cy.get('select[name="country_input"]').select('Colombia')
    cy.contains('button', 'Next').click()
    cy.get('.dc-checkbox__box').click()
    cy.findByText('Choose document').should('be.visible')
    cy.findByText('Passport').click()
    cy.findByText('or upload photo – no scans or photocopies').click()
    cy.findByTestId('date_of_birth').type('2000-09-20')
    cy.get('input[type=file]').selectFile(
      'cypress/fixtures/kyc/testDocument.jpg',
      { force: true }
    )
    cy.findByText('Confirm').click()
  })
})
