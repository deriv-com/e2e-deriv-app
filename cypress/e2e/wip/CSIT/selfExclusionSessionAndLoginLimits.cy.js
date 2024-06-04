import '@testing-library/cypress/add-commands'
const addDays = (n) => {
  let myDate = new Date()
  myDate.setDate(myDate.getDate() + n)
  return myDate.toISOString().slice(0, 10)
}

function setSessionAndLoginLimitExclusion() {
  cy.c_visitResponsive('/account/self-exclusion', 'large')
  cy.findAllByLabelText('Date').first().click()
  cy.get(`[data-date='${addDays(40)}']`).click()
  cy.findByRole('button', { name: 'Next' }).click()
  cy.findByRole('button', { name: 'Accept' }).click()
  cy.findByRole('button', { name: 'Yes, log me out immediately' }).click()
}

function checkSelfExclusionIsSet() {
  cy.c_login()
  cy.c_visitResponsive('/appstore/traders-hub', 'large')
  cy.findByTestId('dt_dropdown_display', { timeout: 10000 }).should('exist')
  cy.findByTestId('dt_dropdown_display').click()
  cy.get('#real', { timeout: 10000 }).should('exist')
  cy.get('#real').click()
  cy.get('[class="dc-text balance-text__text--real"]', {
    timeout: 30000,
  }).should('exist') // waits until Real account is loaded
  cy.c_visitResponsive('/account/self-exclusion', 'large')
  cy.get('input[name="timeout_until"]').should('not.be.empty')
}

function checkDeposit() {
  cy.c_visitResponsive('/cashier/deposit', 'large')
  cy.get('.empty-state').should('be.visible') // checks Deposit is locked
}

function checkTrade() {
  cy.c_visitResponsive(
    '/?chart_type=area&interval=1t&symbol=1HZ100V&trade_type=multiplier',
    'large'
  )
  cy.findByRole('button', { name: 'Up 10.00 USD' }, { timeout: 30000 }).should(
    'exist'
  )
  cy.findByRole('button', { name: 'Up 10.00 USD' }).click()
  cy.get('[class="dc-modal-body"]').should('be.visible') // checks Trade is unavailable
}

function checkNewAccountCreation() {
  cy.c_visitResponsive('/appstore/traders-hub', 'large')
  cy.get('[class="dc-text balance-text__text--real"]', {
    timeout: 30000,
  }).should('exist') // waits until Real account is loaded
  cy.get('[class="dc-btn dc-btn--primary__light"]').first().click()
  cy.findByText(
    'St. Vincent & GrenadinesAssets40+Synthetic indices, basket indices, and derived'
  ).click()
  cy.findByRole('button', { name: 'Next' }).click()
  cy.findByTestId('dt_mt5_password').type(password)
  cy.findByRole('button', { name: 'Create Deriv MT5 password' }).click()
  cy.findByText('Something’s not rightYou have', { timeout: 30000 }).should(
    'exist'
  )
}

function checkHistory() {
  cy.c_visitResponsive('/reports/statement', 'large')
  cy.get('.dc-data-table').should('be.visible') // checks records from Statement are visible
}

describe('QATEST-116798 Self Exclusion Session and login limits on desktop', () => {
  beforeEach(() => {
    cy.c_createRealAccount('large')
    cy.c_login('large')
  })

  it('should login, set self exclusion and verify it applied ', () => {
    setSessionAndLoginLimitExclusion()
    checkSelfExclusionIsSet()
    // checkNewAccountCreation() wip (CSIT-1120)
    // checkHistory() // wip (CSIT-1120)
    // checkDeposit() // wip (CSIT-1120)
    // checkTrade() // wip (CSIT-1120)
  })
})

describe('QATEST-116798 Self Exclusion Session and login limits on mobile', () => {
  beforeEach(() => {
    cy.c_createRealAccount('large')
    cy.c_login('large')
  })

  it('should login, set self exclusion and verify it applied ', () => {
    setSessionAndLoginLimitExclusion()
    checkSelfExclusionIsSet()
    // checkNewAccountCreation() wip (CSIT-1120)
    // checkHistory() // wip (CSIT-1120)
    // checkDeposit() // wip (CSIT-1120)
    // checkTrade() // wip (CSIT-1120)
  })
})
