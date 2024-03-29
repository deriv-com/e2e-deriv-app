import '@testing-library/cypress/add-commands'

function fiat_transfer(to_account) {
  cy.findByText('Transfer to').click()
  cy.findByText(`${to_account} Wallet`).click()
  //transfer more than account balance error verification
  cy.get('input[class="wallets-atm-amount-input__input"]')
    .eq(1)
    .click()
    .type('11000.000')
  // transfer with permitted amount
  cy.findByText('Your USD Wallet has insufficient balance.').should('exist')
  cy.get('input[class="wallets-atm-amount-input__input"]').eq(1).clear()
  cy.get('input[class="wallets-atm-amount-input__input"]')
    .eq(1)
    .click()
    .type('1.000')
  //Check the transfer limit message
  cy.contains(
    'lifetime transfer limit from USD Wallet to any cryptocurrency Wallets is'
  ).should('exist')
  cy.get('form')
    .findByRole('button', { name: 'Transfer', exact: true })
    .should('be.enabled')
    .click()
  cy.c_transferLimit('10.00 USD')
}

describe('WALL-2858 - Fiat transfer and transactions', () => {
  //Prerequisites: Fiat wallet account in any qa box with 10,000.00 USD balance and BTC, ETH and LTC wallets
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to perform transfer from fiat account', () => {
    cy.log('Transfer from Fiat account')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.findByText('Transfer').first().click()
    fiat_transfer('BTC')
    fiat_transfer('ETH')
    fiat_transfer('LTC')
  })

  it('should be able to view transactions of fiat account', () => {
    cy.log('View Transactions of Fiat account')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.findByText('Transactions').first().click()
    cy.findByTestId('dt_wallets_textfield_icon_right')
      .findByRole('button')
      .click()
    cy.findByRole('option', { name: 'Deposit' }).click()
    cy.findByText('+10,000.00 USD')
    cy.findByTestId('dt_wallets_textfield_icon_right')
      .findByRole('button')
      .click()
    cy.findByRole('option', { name: 'Withdrawal' }).click()
    cy.findByText('No recent transactions')
    cy.findByTestId('dt_wallets_textfield_icon_right')
      .findByRole('button')
      .click()
    cy.findByRole('option', { name: 'Transfer' }).click()
    cy.findAllByText(/LTC Wallet/)
      .first()
      .should('be.visible')
    cy.findAllByText(/ETH Wallet/)
      .first()
      .should('be.visible')
    cy.findAllByText(/BTC Wallet/)
      .first()
      .should('be.visible')
    cy.findAllByText(/-10.00 USD/)
      .first()
      .should('be.visible')
  })
})
