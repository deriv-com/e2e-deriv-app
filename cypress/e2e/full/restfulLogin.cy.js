import '@testing-library/cypress/add-commands'
const { getLoginToken } = require('../../support/common');

describe('Get token using RESTful API Request', () => {
  beforeEach(() => {
    cy.log('<E2EToken - beforeEach>' + Cypress.env('oAuthToken'))
    cy.c_login()
  })

  it('should get the oauth token from API', () => {

    cy.log('<E2EToken - Test 1>' + Cypress.env('oAuthToken'))

  });

  it('should get the ouauth token from env variable', () => {

    cy.log('<E2EToken - Test 2>' + Cypress.env('oAuthToken'))

  });
  
});



  