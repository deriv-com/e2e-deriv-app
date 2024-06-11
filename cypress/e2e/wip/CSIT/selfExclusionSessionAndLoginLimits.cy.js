const addDays = (n) => {
  let myDate = new Date()
  myDate.setDate(myDate.getDate() + n)
  return myDate.toISOString().slice(0, 10)
}

describe('QATEST-116798 Self Exclusion Session and login limits on desktop', () => {
  beforeEach(() => {
    cy.c_visitResponsive('/')
    cy.c_createRealAccount()
    cy.c_login()
  })

  it('should login, set self exclusion and verify its applied ', () => {
    cy.c_visitResponsive('/account/self-exclusion', 'large')
    cy.findAllByLabelText('Date').first().click()
    cy.get(`[data-date='${addDays(40)}']`).click()
    cy.findByRole('button', { name: 'Next' }).click()
    cy.findByRole('button', { name: 'Accept' }).click()
    cy.findByRole('button', { name: 'Yes, log me out immediately' }).click()
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.findByTestId('dt_dropdown_display', { timeout: 10000 }).should('exist')
    cy.findByTestId('dt_dropdown_display').click()
    cy.get('#real', { timeout: 10000 }).should('exist')
    cy.get('#real').click()
    cy.findAllByTestId('dt_balance_text_container').should('have.length', '2') // waits until Real account is loaded
    cy.c_visitResponsive('/account/self-exclusion', 'large')
    cy.get('input[name="timeout_until"]').should('not.be.empty')
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.findByTestId('dt_trading-app-card_real_standard')
      .findByRole('button', { name: 'Get' })
      .click()
    cy.findByText('St. Vincent & Grenadines').click()
    cy.findByRole('button', { name: 'Next' }).click()
    cy.findByText('Create a Deriv MT5 password').should('be.visible')
    cy.findByText(
      'You can use this password for all your Deriv MT5 accounts.'
    ).should('be.visible')
    cy.findByTestId('dt_mt5_password').type(
      Cypress.env('credentials').test.diel.PSWD
    )
    cy.findByRole('button', { name: 'Create Deriv MT5 password' }).click()
    cy.get('.dc-dialog__dialog').should('contain.text', 'Something’s not right')
    cy.c_visitResponsive('/cashier/deposit', 'large')
    cy.get('.empty-state').should('be.visible') // checks Deposit is locked
    cy.c_visitResponsive(
      '/?chart_type=area&interval=1t&symbol=1HZ100V&trade_type=multiplier',
      'large'
    )
    cy.findByRole(
      'button',
      { name: 'Up 10.00 USD' },
      { timeout: 30000 }
    ).should('exist')
    cy.findByRole('button', { name: 'Up 10.00 USD' }).click()
    cy.get('.dc-modal-body').should('be.visible') // checks Trade is unavailable
  })
})
