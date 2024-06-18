describe('QATEST-4249: Bot Builder - Search block menu', () => {
    beforeEach(() => {
      cy.c_visitResponsive('/')
      cy.c_createRealAccount()
      cy.c_login()
    })
  
    it('Login from app.deriv.com, opening DBot and checking of valid/invalid requests in Search bar on Desktop', () => {
      cy.c_visitResponsive('/bot#bot_builder', 'large')
      cy.c_skipTour() //presses skip button
      cy.findByPlaceholderText('Search')
        .type('Trading')
        .should('have.value', 'Trading')
      cy.get('[class="flyout flyout__search"]', { timeout: 10000 }).should(
        'exist'
      )
      cy.findByRole('heading', { name: 'No results found' }).should('not.exist')
  
      cy.findByPlaceholderText('Search')
        .clear()
        .type('book')
        .should('have.value', 'book')
      cy.findByRole('heading', { name: 'No results found' }).should('exist')
    })
  })