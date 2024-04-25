import '@testing-library/cypress/add-commands'

describe('QATEST-123731 - IDV (2 attempts) and Onfido (1 attempt) failed clients are redirected to manual upload', () => {
  beforeEach(() => {
    cy.c_visitResponsive('/')
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
    cy.wait(1000)
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
    cy.wait(1000)
    cy.reload()

    // Onfido flow
    cy.findByRole('button', { name: 'Upload identity document' }).click()
    cy.c_onfidoSecondRun('Ghana')
    cy.findByText('Your documents were submitted successfully').should(
      'be.visible'
    )
    // Manual flow
    cy.wait(5000)
    cy.reload()
    cy.findByText('Please upload one of the following documents:').should(
      'be.visible'
    )
  })
})
