describe('QA-TEST-149356 POI through MT5 acc creation', () => {
  beforeEach(() => {
    cy.c_visitResponsive('small')
    cy.c_createRealAccount('ke')
    cy.c_login()
  })
  it('should be able to upload POI through MT5 account creation', () => {
    cy.c_visitResponsive('appstore/traders-hub', 'small')
    cy.findByRole('button', { name: 'CFDs' }).click()
    cy.findByTestId('dt_trading-app-card_real_standard')
      .findByRole('button', { name: 'Get' })
      .click()
    cy.findByText('British Virgin Islands').click()
    cy.get('input.dc-checkbox__input').check({ force: true })
    cy.findByRole('button', { name: 'Next' }).click()
    cy.get('select[name="document_type"]').select('Passport')
    cy.findByLabelText('Enter your document number').type('A00000001')
    cy.findByTestId('first_name').clear().type('test')
    cy.findByTestId('last_name').clear().type('man')
    cy.findByTestId('date_of_birth').type('1990-01-01')
    cy.get('.dc-checkbox__box').click()
    cy.findByRole('button', { name: 'Next' }).click()
    cy.findByTestId('dt_dc_mobile_dialog_close_btn').click()
    cy.findByText('Your proof of identity verification has failed', {
      timeout: 50000,
    }).should('exist') // Failure expected due to document rejected
  })
})
