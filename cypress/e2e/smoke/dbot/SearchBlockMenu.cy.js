describe('QATEST-4249: Bot Builder - Search block menu', () => {
  beforeEach(() => {
    cy.c_createRealAccount()
    cy.c_login()
  })
  it('Should login from app.deriv.com, opening DBot and checking of valid/invalid requests in Search bar', () => {
    cy.c_visitResponsive('/bot#bot_builder', 'large')
    cy.c_skipTour()
    cy.findByPlaceholderText('Search')
      .type('Trading')
      .should('have.value', 'Trading')
    cy.contains('Results for "Trading"')

    cy.findByPlaceholderText('Search')
      .clear()
      .type('book')
      .should('have.value', 'book')
    cy.findByRole('heading', { name: 'No results found' }).should('be.visible')
  })
})
