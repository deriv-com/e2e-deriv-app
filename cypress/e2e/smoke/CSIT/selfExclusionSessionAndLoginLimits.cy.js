import '@testing-library/cypress/add-commands'

function createClientAndLogin() {
  cy.log('<E2EOAuthUrl - beforeEach>' + Cypress.env('oAuthUrl'))
  cy.c_visitResponsive('/')
  cy.c_createRealAccount()
  cy.c_login()
}

function setSessionAndLoginLimitExclusion() {
  cy.c_visitResponsive('/account/self-exclusion', 'large')
  cy.get('input[name="timeout_until"]').click()
  cy.get('[data-duration="13 Days"]').click() // selects 13 day from the current day
  cy.findByRole('button', { name: 'Next' }).click()
  cy.findByRole('button', { name: 'Accept' }).click()
  cy.findByRole('button', { name: 'Yes, log me out immediately' }).click()
}

function checkSelfExclusionIsSet() {
  cy.c_login()
  cy.c_visitResponsive('/appstore/traders-hub', 'large')
  cy.wait(2000) // waits until page is loaded
  cy.findByTestId('dt_dropdown_display').click()
  cy.wait(1000) // waits until dropdown values are displayed
  cy.get('#real').click()
  cy.wait(2000) // waits until demo is switced to real and page is loaded
  cy.c_visitResponsive('/account/self-exclusion', 'large')
  cy.get('input[name="timeout_until"]').should('not.be.empty')
}

function checkDeposit() {
  cy.c_visitResponsive('/cashier/deposit', 'large')
  cy.get('.empty-state').should('be.visible') // checks Deposit is locked
}

function checkWithdrawal() {
  cy.c_visitResponsive('/cashier/deposit', 'large')
  cy.findByTestId('dt_empty_state_action').should('be.visible') // checks Send withdrawal email button is visible - withdrawal not locked
}

function checkTrade() {
  cy.c_visitResponsive(
    '/?chart_type=area&interval=1t&symbol=1HZ100V&trade_type=multiplier',
    'large'
  )
  cy.findByRole('button', { name: 'Up 10.00 USD' }).click()
  cy.findByText('You have chosen to exclude').should('be.visible') // checks Trade is unavailable
}

function checkNewAccountCreation() {
  cy.c_visitResponsive('/appstore/traders-hub', 'large')
  cy.findByTestId('dt_currency-switcher__arrow').click()
  cy.findByRole('button', { name: 'Add or manage account' }).click()
  cy.get('label').filter({ hasText: 'Bitcoin(BTC)' }).click()
  cy.findByRole('button', { name: 'Add account' }).click()
  cy.findByText('You have chosen to exclude').should('be.visible') // checks New account creation is unavailable
}

function addRecordToTradeTable() {
  cy.c_visitResponsive(
    '/?chart_type=area&interval=1t&symbol=1HZ100V&trade_type=multiplier',
    'large'
  )
  cy.wait(2000) // waits until page is loaded
  cy.findByRole('button', { name: 'Up 10.00 USD' }).click()
  cy.wait(2000) // waits for trade to work
  cy.findByRole('button', { name: 'Close' }).click()
}

function checkHistory() {
  cy.c_visitResponsive('/reports/profit', 'large')
  cy.get('.dc-data-table').should('be.visible') // checks records from Trade table are visible
  cy.c_visitResponsive('/reports/statement', 'large')
  cy.get('.dc-data-table').should('be.visible') // checks records from Statement are visible
}

describe('QATEST-116798 Self Exclusion Session and login limits on desktop', () => {
  it('should login, set self exclusion and verify it applied', () => {
    createClientAndLogin()
    setSessionAndLoginLimitExclusion()
    checkSelfExclusionIsSet()
    checkDeposit()
  })
})
