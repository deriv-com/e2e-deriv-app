it('allows user to login with correct credentials', () => {
  cy.visit('/login')
  cy.get('#username').type('user123')
  cy.get('#password').type('password123')
  cy.get('#loginBtn').click()
  cy.url().should('include', '/dashboard')
})
