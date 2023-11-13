import '@testing-library/cypress/add-commands'

describe('QATEST-20309, QATEST-20310 - Login to an existing account.', () => {
  beforeEach(() => {
    cy.c_mt5login()
  })

  it('Should show the mt5 home page after login.', () => {
    cy.findByTitle('Menu').findByRole('img').click()
    cy.findByText('Trading accounts').should('be.visible')
  })

})