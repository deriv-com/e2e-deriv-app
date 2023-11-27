import '@testing-library/cypress/add-commands'

describe('QATEST-9999 - <Clickup description here>', () => {
  beforeEach(() => {
    cy.c_login('wallets')
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to test cashier step 1 ...', () => {

    cy.log('Tests to go here!')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
  
  })

  it('should be able to test cashier step 2 ...', () => {

    cy.log('Tests to go here!')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
  
  })

})
