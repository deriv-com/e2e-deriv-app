import '@testing-library/cypress/add-commands'

describe('QATEST-5014 - Verify Main Page', () => {
  beforeEach(() => {
    cy.c_mt5login()
  })

  it('Account switcher / Markets menu / Trade Types', () => {
    cy.findByTitle('Menu').click()
    cy.findByText('Chart settings').should('be.visible')
    cy.findByText('Trading accounts').should('be.visible')
  })

})