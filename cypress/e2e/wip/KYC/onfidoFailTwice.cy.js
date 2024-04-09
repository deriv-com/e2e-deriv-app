import '@testing-library/cypress/add-commands'

describe('QATEST-22853 Onfido (2 attempts) failed clients are redirected to manual upload', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_navigateToPoiResponsive('Colombia')
  })

  it('Onfido should fail twice and then manual upload screen should be displayed', () => {
    for (let i = 0; i < 2; i++) {
      // if (cy.get('.dc-btn')) {
      //   cy.get('.dc-btn').click()
      //   continue
      // }
      cy.findByText('Maybe later').click()
      cy.c_fixPassKeysScreen('Colombia')
      cy.get('.dc-checkbox__box').click()
      cy.findByText('Choose document').should('be.visible')
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
      cy.wait(5000)
      cy.reload()
      cy.c_closeNotificationHeader()
      cy.findByText('Proof of address required').should('be.visible')
      cy.c_closeNotificationHeader()
      cy.findByText('Your proof of identity submission failed because:')
      //cy.findByRole(document.body, 'button', { name: 'Verify again' })
      cy.get('.dc-btn').click()
    }
  })
})
