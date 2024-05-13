import '@testing-library/cypress/add-commands'

function fiat_transfer(to_account) {
  cy.findByText('Transfer to').click()
  cy.findByText(`${to_account}`).click()
  //transfer more than account balance error verification
  cy.get('input[class="wallets-atm-amount-input__input"]')
    .eq(1)
    .click()
    .type('11000.000')
  // transfer with permitted amount
  cy.findByText('Your USD Wallet has insufficient balance.').should('exist')
  cy.get(
    'input[class="wallets-atm-amount-input__input wallets-atm-amount-input__input--error"]'
  )
    .eq(1)
    .clear()
  cy.get('input[class="wallets-atm-amount-input__input"]')
    .eq(1)
    .click()
    .type('1.000')
  //Check the transfer limit message
  if (`${to_account}` == 'Options') {
    cy.contains(
      'transfer limit between your USD Wallet and Options is '
    ).should('exist')
  } else {
    cy.contains(
      'lifetime transfer limit from USD Wallet to any cryptocurrency Wallets is'
    ).should('exist')
  }
  cy.get('form')
    .findByRole('button', { name: 'Transfer', exact: true })
    .should('be.enabled')
    .click()
  cy.c_transferLimit('10.00 USD')
  if (`${to_account}` != 'Options') {
    cy.contains('Transfer fees:')
  }
  cy.findByRole('button', { name: 'Make a new transfer' }).click()
}

describe('QATEST-141444 Fiat to Cryptpo wallet transfer and QATEST-98808 - View Fiat transaction', () => {
  //Prerequisites: Fiat wallet account in any qa box with 10,000.00 USD balance and BTC, ETH and LTC wallets
  beforeEach(() => {
    cy.c_login({ app: 'wallets', user: 'wallets' })
  })

  it('should be able to perform transfer from fiat account', () => {
    cy.log('Transfer from Fiat account')
    cy.c_visitResponsive('/wallets', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.findByText('Transfer').first().click()
    fiat_transfer('Options')
    fiat_transfer('BTC Wallet')
    fiat_transfer('ETH Wallet')
    fiat_transfer('LTC Wallet')
  })

  it('should be able to view transactions of fiat account', () => {
    cy.log('View Transactions of Fiat account')
    cy.c_visitResponsive('/wallets', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.findByText('Transfer').first().click()
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
    cy.findAllByText(/Options/)
      .first()
      .should('be.visible')
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
  it('should be able to perform transfer from fiat account in responsive', () => {
    cy.log('Transfer from Fiat account')
    cy.c_visitResponsive('/wallets', 'small')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.findByText('Transfer').parent().click()
    fiat_transfer('Options')
    fiat_transfer('BTC Wallet')
    fiat_transfer('ETH Wallet')
    fiat_transfer('LTC Wallet')
  })
  it('should be able to view transactions of fiat account in responsive', () => {
    cy.log('View Transactions of Fiat account')
    cy.c_visitResponsive('/wallets', 'small')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.findByText('Transfer').parent().click()
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
    cy.findAllByText(/Options/)
      .first()
      .should('be.visible')
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
