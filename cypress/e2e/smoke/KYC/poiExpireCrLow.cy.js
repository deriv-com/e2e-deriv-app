describe('QATEST-160108 Cashier lock when POI expire CR - Low', () => {
  beforeEach(() => {
    cy.c_createCRAccount({ country_code: 'aq' })
    cy.c_login()
    cy.findByTestId('dt_traders_hub').should('be.visible')
    cy.c_navigateToPoiResponsive('Antarctica')
  })

  it('Should have no cashier lock when POI expire for CR low risk.', () => {
    /* Submit POA */
    cy.findByText('Passport').should('be.visible').click()
    cy.findByLabelText('Passport number*').type('232344')
    cy.get('.dc-datepicker__native').type('2025-09-20')
    cy.findByRole('button', { name: 'Next' }).should('not.be.enabled')
    cy.get('input[type=file]').selectFile(
      'cypress/fixtures/kyc/testDriversLicense.jpeg',
      { force: true }
    )
    cy.findByRole('button', { name: 'Next' }).should('be.enabled').click()
    cy.findByRole('button', { name: 'Confirm and upload' }).should(
      'not.be.enabled'
    )
    cy.get('input[type=file]').selectFile('cypress/fixtures/kyc/selfie.jpeg', {
      force: true,
    })
    cy.findByRole('button', { name: 'Confirm and upload' })
      .should('be.enabled')
      .click()
    cy.findByText('Your documents were submitted successfully').should(
      'be.visible'
    )
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
    cy.get('#documents_wrapper table tbody tr td input[type="checkbox"]')
      .first()
      .should('exist')
      .check()
    cy.findByRole('button', { name: /Verify Checked Files/i }).click()
    cy.get('select[name="client_authentication"]')
      .select('Authenticated with scans')
      .type('{enter}')
    cy.get(
      '#documents_wrapper table tbody tr td input[name^="expiration_date_"]'
    )
      .clear()
      .type('2021-09-20')
    cy.get('input[value="Save client details"]').last().click()
    /* No cashier lock in BO */
    cy.get('#card__content table tbody tr td b Withdrawal Locked').should(
      'not.exist'
    )
    cy.get('select[name="client_aml_risk_classification"]')
      .select('Low')
      .should('be.visible')
    /* Check no cashier lock on FE */
    cy.c_visitResponsive('/cashier/deposit', 'small')
    cy.findByText('Deposit via bank wire, credit card, and e-wallet').should(
      'be.visible'
    )
  })
})
