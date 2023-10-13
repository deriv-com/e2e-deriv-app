import '@testing-library/cypress/add-commands'

describe('About Us Tests', () => {

  it('Full size', () => {
    cy.c_visitResponsive('/', 'large')

    cy.findByRole('navigation').findByText('About us').click()
    cy.findByRole('link', { name: 'Who we are' }).click()
    cy.findByRole('heading', { name: 'Who we are' }).click()

    cy.findAllByRole('list').findByText('About us').click()

  })


})