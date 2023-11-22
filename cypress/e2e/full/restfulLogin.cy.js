import '@testing-library/cypress/add-commands'
const { getLoginToken } = require('../../support/common');

describe('Get token using RESTful API Request', () => {
  beforeEach(() => {
    cy.log('<E2EToken - beforeEach>' + Cypress.env('oAuthToken'))
    cy.c_login()
  })

  it('(Test run 1) Login called, show the e2e token value', () => {

    cy.log('<E2EToken - Test 1>' + Cypress.env('oAuthToken'))

  });

  it('(Test run 2) Login called, show the e2e token value', () => {

    cy.log('<E2EToken - Test 2>' + Cypress.env('oAuthToken'))

  });
  
});



  