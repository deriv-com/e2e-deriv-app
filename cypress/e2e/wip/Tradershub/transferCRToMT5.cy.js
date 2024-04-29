import '@testing-library/cypress/add-commands'

describe('QATEST-6064 Validate the transfer from CR to MT5 when CR account is having account balance', () => {
  it('Should validate the transfer functionality from CR to MT5 account when CR account is having balance ', () => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.findByRole('button', { name: 'Transfer' }).should('be.visible').click()
    cy.findByRole('heading', { name: 'Transfer funds to your accounts' })
      .should('be.visible')
      .click()
    cy.findByTestId('dt_account_transfer_form_input').click().type('10')
    cy.get('.account-transfer-form__submit-button').click()
    cy.findByRole('heading', {
      name: 'Your funds have been transferred',
    }).should('be.visible')
    cy.get('.crypto-transfer-from-details').contains('USD')
    cy.findByText('Close').should('be.visible')
    cy.findByRole('button', { name: 'View transaction details' })
      .should('be.visible')
      .click()
    cy.url().should('contain', 'reports/statement')
    cy.findByText('Reports').should('be.visible')
  })
})

describe('QATEST-6060 Validate the transfer from CR to MT5 when CR account is not having account balance', () => {
  beforeEach(() => {
    Cypress.env('oAuthUrl', '<empty>')
  })

  it('Should validate the transfer functionality from CR to MT5 account when CR account is not having balance ', () => {
    cy.c_visitResponsive('/')
    cy.c_createRealAccount()
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.findAllByRole('button', { name: 'Get' }).first().click()
    cy.findByText('St. Vincent & Grenadines').click()
    cy.findByRole('button', { name: 'Next' }).click()
    cy.findByText('Create a Deriv MT5 password').should('be.visible')
    cy.findByTestId('dt_mt5_password').type(Cypress.env('mt5Password'), {
      log: false,
    })
    cy.findByRole('button', { name: 'Create Deriv MT5 password' }).click()
    cy.findByRole('button', { name: 'Maybe later' })
      .should('be.visible')
      .click()
    cy.findByRole('button', { name: 'Transfer' }).should('be.visible').click()
    cy.findByRole('heading', { name: 'Transfer funds to your accounts' })
      .should('be.visible')
      .click()
    cy.findByRole('heading', {
      name: 'You have no funds in your USD account',
    }).should('be.visible')
    cy.findByText('Please make a deposit to use this feature.').should(
      'be.visible'
    )
    cy.findByRole('button', { name: 'Deposit now' })
      .should('be.visible')
      .click()
    cy.url().should('contain', 'cashier/deposit')
    cy.findByText('Deposit via bank wire, credit card, and e-wallet').should(
      'be.visible'
    )
  })
})
