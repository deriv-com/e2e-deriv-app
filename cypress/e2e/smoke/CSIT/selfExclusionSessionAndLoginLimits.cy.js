import '@testing-library/cypress/add-commands'

function createClientAndLogin() {
  cy.log('<E2EOAuthUrl - beforeEach>' + Cypress.env('oAuthUrl'))
  cy.c_createRealAccount()
  cy.c_login()
}

function setSessionAndLoginLimitExclusion() {
  cy.c_visitResponsive('/account/self-exclusion', 'large')
  cy.get('input[name="timeout_until"]').click()
  cy.get('[data-duration="13 Days"]').click()
  cy.findByRole('button', { name: 'Next' }).click()
  cy.findByRole('button', { name: 'Accept' }).click()
  cy.findByRole('button', { name: 'Yes, log me out immediately' }).click()
}

function checkSelfExclusionIsSet() {
  cy.c_login()
  cy.c_visitResponsive('/appstore/traders-hub', 'large')
  cy.wait(2000)
  cy.findByTestId('dt_dropdown_display').click()
  cy.wait(1000)
  cy.get('#real').click()
  cy.wait(2000)
  cy.c_visitResponsive('/account/self-exclusion', 'large')
  cy.get('input[name="timeout_until"]').should('not.be.empty')
}

describe('QATEST-116798 Self Exclusion Session and login limits on desktop', () => {
  it('should login, set self exclusion and verify it applied', () => {
    createClientAndLogin()
    setSessionAndLoginLimitExclusion()
    checkSelfExclusionIsSet()
  })
})
