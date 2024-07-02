describe('QATEST-5341 - Verify account_opening_new is triggered as transactional email', () => {
  it(`should verify account_opening_new are triggered as transactional emails on Mobile`, () => {
    cy.c_visitResponsive('/')
    cy.task('wsConnect')

    cy.task('verifyEmailTask').then((accountEmail) => {
      cy.c_emailContentVerification(
        'CustomerIO_account_opening_new.html',
        accountEmail,
        'account_opening_new',
        true
      )
    })
  })
})
