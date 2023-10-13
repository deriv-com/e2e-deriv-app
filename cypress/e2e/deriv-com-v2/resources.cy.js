import '@testing-library/cypress/add-commands'

describe('Resources Tests', () => {

  it('Full size', () => {
    cy.c_visitResponsive('/', 'large')

    cy.findAllByRole('list').findByText('Resources').click()
    cy.findByRole('link', { name: 'Help Centre' }).click()
    cy.findByRole('heading', { name: 'How can we help?' }).should('be.visible')

  })


})