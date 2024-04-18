import '@testing-library/cypress/add-commands'

describe('QATEST-123731 - IDV (2 attempts) and Onfido (1 attempt) failed clients are redirected to manual upload', () => {
  beforeEach(() => {
    cy.c_createRealAccount()
    cy.c_login()
    cy.c_navigateToPoiResponsive('Ghana')
  })

  it('IDV (2 attempts) and Onfido (1 attempt) failed clients should be redirected to manual upload', () => {
    // IDV flow
    cy.c_submitIdv() // first IDV attempt
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
    cy.get('select[name="country_input"]').select('Ghana')
    cy.contains('button', 'Next').click()

    cy.c_submitIdv() // second IDV attempt
    cy.reload()

    // Onfido flow
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
    cy.findByText('Continue').click()
    cy.findByText('Take a selfie').should('be.visible')
    cy.get('.onfido-sdk-ui-Camera-btn').click()
    cy.findByText('Confirm').click()
    cy.findByText('Your documents were submitted successfully').should(
      'be.visible'
    )
    cy.reload()

    // Manual upload screen
    cy.findByText('Please upload one of the following documents:').should(
      'be.visible'
    )
  })
})
