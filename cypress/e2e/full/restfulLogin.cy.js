const { getLoginToken } = require('../../support/common');

describe('Get token using RESTful API Request', () => {
  beforeEach(() => {
    cy.log('<E2EToken1>' + Cypress.env('E2EToken'))
    cy.c_login()
  })

  it('Login called, show the e2e token value', () => {

    cy.log('<E2EToken2>' + Cypress.env('E2EToken'))

  });

  it('Login called, show the e2e token value', () => {

    cy.log('<E2EToken3>' + Cypress.env('E2EToken'))

  });
  
});



  