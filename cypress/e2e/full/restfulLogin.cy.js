const { getLoginToken } = require('../../support/common');

describe('Get token using RESTful API Request', () => {
  beforeEach(() => {
    cy.log('<E2EToken - beforeEach>' + Cypress.env('E2EToken'))
    cy.c_login()
  })

  it('(Test run 1) Login called, show the e2e token value', () => {

    cy.log('<E2EToken - Test 1>' + Cypress.env('E2EToken'))

  });

  it('(Test run 2) Login called, show the e2e token value', () => {

    cy.visit('https://app.deriv.com/appstore/traders-hub')
    cy.log('<E2EToken - Test 2>' + Cypress.env('E2EToken'))

  });
  
});



  