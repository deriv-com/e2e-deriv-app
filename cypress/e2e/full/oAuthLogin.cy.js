import '@testing-library/cypress/add-commands'
const { getOAuthLogin } = require('../../support/common');

describe('Get oAuthUrl', () => {
  beforeEach(() => {
    cy.log('<E2EOAuthUrl - beforeEach>' + Cypress.env('oAuthUrl'))
    cy.c_login("")
  })

  it('should get the oauth url from API', () => {

    cy.log('<E2EOAuthUrl - Test 1>' + Cypress.env('oAuthUrl'))
    cy.findByText('Trader\'s Hub').click()
    cy.get('[style="--text-size: var(--text-size-sm); --text-color: var(--text-general); --text-lh: var(--text-lh-m); --text-weight: var(--text-weight-bold); --text-align: var(--text-align-left);"]')

  });

  // it('should get the oauth url from env variable', () => {

  //   cy.log('<E2EOAuthUrl - Test 2>' + Cypress.env('oAuthUrl'))

  // });
  
});


  