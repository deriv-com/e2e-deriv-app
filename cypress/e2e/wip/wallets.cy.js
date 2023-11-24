import '@testing-library/cypress/add-commands'

describe('QATEST-9999 - <Clickup description here>', () => {
  beforeEach(() => {
    cy.c_login('wallets')
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to test 1 ...', () => {

    cy.log('Tests to go here!')
    cy.findByRole('heading', { name: 'CFDs' }).should('be.visible')
  
  })

  it('should be able to test 2 ...', () => {

    cy.log('Tests to go here!')
    cy.findByRole('heading', { name: 'CFDs' }).should('be.visible')
  
  })

})
