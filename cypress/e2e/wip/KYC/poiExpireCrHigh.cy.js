import '@testing-library/cypress/add-commands'

const BO_URL = `https://${Cypress.env('configServer')}${Cypress.env('qaBOEndpoint')}`
describe('QATEST-160111 Cashier lock when POI expire CR - High.', () => {
  beforeEach(() => {
    cy.c_createRealAccount('aq')
    cy.c_login()
    cy.findByTestId('dt_traders_hub').should('be.visible')
    cy.c_navigateToPoiResponsive('Antarctica')
  })

  it('Should have cashier lock when POI expire for CR high risk', () => {
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
    cy.visit(BO_URL)
    cy.findByText('Please login.').click()
    cy.findByText('Client Management').click()
    cy.findByPlaceholderText('email@domain.com')
      .should('exist')
      .clear()
      .type(Cypress.env('credentials').test.masterUser.ID)
    cy.findByRole('button', { name: /View \/ Edit/i }).click()
    cy.get('.link').eq(1).should('be.visible').click()
    cy.get('#documents_wrapper table tbody tr td input[type="checkbox"]')
      .first()
      .last()
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

    cy.get('select[name="client_aml_risk_classification"]')
      .select('High')
      .type('{enter}')
    /* cashier locks in BO */
    cy.get('b[style*="font-size: 1.3rem"][style*="color:var(--color-red)"]')
      .contains('Withdrawal Locked')
      .should('be.visible')
    cy.get('b[style*="font-size: 1.3rem"][style*="color:var(--color-red)"]')
      .contains('Cashier Locked')
      .should('be.visible')
    // /* Check no cashier lock on FE */
    cy.c_visitResponsive('/cashier/deposit', 'small')
    cy.findByText('Cashier is locked').should('be.visible')
    cy.findByText(
      'The identification documents you submitted have expired. Please submit valid identity documents to unlock Cashier.'
    ).should('be.visible')
  })
})
