describe('Verify account_closure are triggered as transactional email', () => {
  beforeEach(() => {
    cy.c_createRealAccount()
    cy.c_login()
  })
  it(`QATEST-162618 - Verify account_closure are triggered as transactional emails on Mobile`, () => {
    cy.c_visitResponsive('account/closing-account')
    cy.findByRole('button', { name: 'Close my account' }).click()
    cy.findByText('I’m closing my account for other reasons.').click()
    cy.findByRole('button', { name: 'Continue' }).click()
    cy.findByRole('button', { name: 'Close account' }).click()
    cy.c_emailContentVerification(
      'CustomerIO_account_closure.html',
      Cypress.env('credentials').test.masterUser.ID
    )
  })
})
