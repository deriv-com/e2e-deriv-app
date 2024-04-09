import '@testing-library/cypress/add-commands'

describe('QATEST-123731 - IDV (2 attempts) and Onfido (1 attempt) failed clients are redirected to manual upload', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_navigateToPoiResponsive('Republic of QA')
  })

  it('IDV (2 attempts) and Onfido (1 attempt) failed clients should be redirected to manual upload', () => {
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

    cy.contains('ID verification failed').should('be.visible')
    cy.contains(
      'We were unable to verify your ID with the details you provided. Please upload your identity document.'
    ).should('be.visible')
    cy.findByRole('button', { name: 'Upload identity document' })
    cy.get('select[name="country_input"]').select('Colombia')
    cy.contains('button', 'Next').click()
    cy.findByTestId('date_of_birth').type('2000-09-20')
    cy.get('.dc-checkbox__box').click()
    cy.findByText('Choose your document').should('exist')
    cy.findByText('Passport').click()
  })
})
