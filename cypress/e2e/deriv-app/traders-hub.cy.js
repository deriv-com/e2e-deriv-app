import '@testing-library/cypress/add-commands'

describe('Traders Hub', () => {

  it('Access apps', () => {
    cy.visitResponsive('/appstore/traders-hub', 'large')


  })


})