import '@testing-library/cypress/add-commands'

describe('QATEST-4835 POA Verify', () => {
  beforeEach(() => {
    // cy.c_visitResponsive('/')
    // cy.c_createRealAccount()
    cy.c_login()
    cy.c_navigateToPoaResponsive()
  })

  it('Should show verify page when POA is verified', () => {
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
  })
})
