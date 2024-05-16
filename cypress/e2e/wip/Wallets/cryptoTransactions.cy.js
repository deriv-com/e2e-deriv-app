import '@testing-library/cypress/add-commands'

function crypto_transfer(to_account, transferAmount) {
  cy.findByText('Transfer to').click()
  cy.findByText(`${to_account} Wallet`).click()
  cy.get('input[class="wallets-atm-amount-input__input"]')
    .eq(1)
    .click()
    .type('0.000003000')
  // if (to_account == 'USD') {
  //   cy.contains(
  //     'lifetime transfer limit from BTC Wallet to any fiat Wallets is'
  //   )
  // } else {
  //   cy.contains('lifetime transfer limit between cryptocurrency Wallets is')
  // }
  cy.contains('daily transfer limit between your Wallets').should('be.visible')
  cy.get('form')
    .findByRole('button', { name: 'Transfer', exact: true })
    .should('be.enabled')
    .click()
  cy.c_transferLimit(transferAmount)
  cy.contains('Transfer fees:')
  cy.findByRole('button', { name: 'Make a new transfer' }).click()
}

describe('QATEST-98789 - Transfer to crypto accounts and QATEST-98794 View Crypto transactions and QATEST-99429 Transfer conversion rate and QATEST-99714 Life time transfer limit message', () => {
  //Prerequisites: Crypto wallet account in any qa box with 1.00000000 BTC balance and USD, ETH and LTC wallets
  let transferAmount = '0.00003000 BTC'
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
  })

  it('should be able to perform transfer from crypto account', () => {
    cy.log('Transfer from Crypto account')
    cy.c_visitResponsive('/wallets', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_switchWalletsAccount('BTC')
    cy.contains('Transfer').click()
    crypto_transfer('USD', transferAmount)
    crypto_transfer('ETH', transferAmount)
    crypto_transfer('LTC', transferAmount)
  })

  it('should be able to view transactions of crypto account', () => {
    cy.log('View Transactions of Crypto account')
    cy.c_visitResponsive('/wallets', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_switchWalletsAccount('BTC')
    cy.contains('Transfer').click()
    cy.findByText('Transactions').first().click()
    cy.findByTestId('dt_wallets_textfield_box').click()
    cy.findByRole('option', { name: 'Deposit' }).click()
    cy.findByText('+5.00000000 BTC')
    cy.findByTestId('dt_wallets_textfield_box').click()
    cy.findByRole('option', { name: 'Withdrawal' }).click()
    cy.findByText('No transactions found')
    cy.findByTestId('dt_wallets_textfield_box').click()
    cy.findByRole('option', { name: 'Transfer' }).click()
    cy.findAllByText(/LTC Wallet/)
      .first()
      .should('be.visible')
    cy.findAllByText(/ETH Wallet/)
      .first()
      .should('be.visible')
    cy.findAllByText(/USD Wallet/)
      .first()
      .should('be.visible')
    cy.findAllByText(`-${transferAmount}`).first().should('be.visible')
  })

  it('should be able to perform transfer from crypto account in responsive', () => {
    cy.log('Transfer from Crypto account')
    cy.c_visitResponsive('/wallets', 'small')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_switchWalletsAccountResponsive('BTC')
    cy.contains('Transfer').parent().click()
    crypto_transfer('USD', transferAmount)
    crypto_transfer('ETH', transferAmount)
    crypto_transfer('LTC', transferAmount)
  })

  it('should be able to view transactions of crypto account in responsive', () => {
    cy.log('View Transactions of Crypto account')
    cy.c_visitResponsive('/wallets', 'small')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_switchWalletsAccountResponsive('BTC')
    cy.contains('Transfer').parent().click()
    cy.findByText('Transactions').first().click()
    cy.findByTestId('dt_wallets_textfield_box').click()
    cy.findByRole('option', { name: 'Deposit' }).click()
    cy.findByText('+5.00000000 BTC')
    cy.findByTestId('dt_wallets_textfield_box').click()
    cy.findByRole('option', { name: 'Withdrawal' }).click()
    cy.findByText('No transactions found')
    cy.findByTestId('dt_wallets_textfield_box').click()
    cy.findByRole('option', { name: 'Transfer' }).click()
    cy.findAllByText(/LTC Wallet/)
      .first()
      .should('be.visible')
    cy.findAllByText(/ETH Wallet/)
      .first()
      .should('be.visible')
    cy.findAllByText(/USD Wallet/)
      .first()
      .should('be.visible')
    cy.findAllByText(`-${transferAmount}`).first().should('be.visible')
  })
})
