import '@testing-library/cypress/add-commands'

describe('QATEST-127508 - Onfido (2 attempts) failed clients are redirected to manual upload', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_navigateToPoiResponsive('Colombia')
  })

  it('Onfido should fail twice and then manual upload screen should be displayed', () => {
    cy.findByText('Choose document').should('be.visible')
    cy.get('.dc-checkbox__box').click()
    cy.findByText('Passport').click()
    cy.findByText('Submit passport photo pages').should('be.visible')
    cy.findByText('or upload photo – no scans or photocopies').click()
    cy.findByText('Upload passport photo page').should('be.visible')
    cy.get('input[type=file]').selectFile(
      'cypress/fixtures/kyc/testDriversLicense.jpeg',
      { force: true }
    )
    cy.findByText('Confirm').click()
    cy.findByText('Continue').click()
    cy.findByText('Take a selfie').should('be.visible')
    cy.get('.onfido-sdk-ui-Camera-btn').click()
    cy.findByText('Confirm').click()
    cy.findByText('Account verification required').should('be.visible')
    cy.c_closeNotificationHeader()

    cy.wait(5000)
    cy.reload()
    cy.findByText('Your identity verification failed:').should('be.visible')
    cy.findByRole('button', { name: 'Verify again' }).click()

    cy.findByText('Proof of address required').should('exist')
    cy.c_closeNotificationHeader()
    cy.c_onfidoSecondRun('Colombia')
    cy.findByText('Your documents were submitted successfully').should(
      'be.visible'
    )

    cy.wait(5000)
    cy.reload()
    cy.findByText('Please upload one of the following documents:').should(
      'be.visible'
    )
  })
})
