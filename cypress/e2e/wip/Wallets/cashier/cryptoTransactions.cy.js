import '@testing-library/cypress/add-commands'

function crypto_transfer(to_account) {
  cy.contains('Transfer to').click()
  cy.contains(`${to_account} Wallet`).click()
  cy.get('input[class="wallets-atm-amount-input__input"]')
    .eq(1)
    .click()
    .type('0.000010000')
  if (to_account == 'USD') {
    cy.contains(
      'lifetime transfer limit from BTC Wallet to any fiat Wallets is'
    )
  } else {
    cy.contains('lifetime transfer limit between cryptocurrency Wallets is')
  }
  cy.get('form')
    .findByRole('button', { name: 'Transfer', exact: true })
    .should('be.enabled')
    .click()
  cy.c_transferLimit('0.00010000 BTC')
}

describe('WALL-2858 - Crypto transfer and transactions', () => {
  //Prerequisites: Crypto wallet account in any qa box with 1.00000000 BTC balance and USD, ETH and LTC wallets
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to perform transfer from crypto account', () => {
    cy.log('Transfer from Crypto account')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.get('.wallets-dropdown__button').click()
    cy.get('.wallets-list-card-dropdown__item-content')
      .contains('BTC Wallet')
      .click()
    cy.get('.wallets-list-details__content').within(() => {
      cy.contains('BTC').should('be.visible')
    })
    cy.contains('Transfer').click()
    crypto_transfer('USD')
    crypto_transfer('ETH')
    crypto_transfer('LTC')
  })

  it("should be able to view transactions of crypto account", () => {
    cy.log("View Transactions of Crypto account")
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    cy.findAllByText(/BTC Wallet/).first().scrollIntoView()
    cy.findByTestId('dt_wallets_textfield_icon_right').findByRole('button').click();
    cy.findAllByText('BTC Wallet').first().click();
    cy.contains("Transactions").first().click()
   cy.findByTestId('dt_wallets_textfield_box').click();
   cy.findByRole("option", { name: "Deposit" }).click()
   cy.contains("+5.00000000 BTC")
   cy.findByTestId('dt_wallets_textfield_box').click();
   cy.findByRole("option", { name: "Withdrawal" }).click()
   cy.contains("No recent transactions")
   cy.findByTestId('dt_wallets_textfield_box').click();
    cy.findByRole("option", { name: "Transfer" }).click()
    cy.contains("LTC Wallet")
    cy.contains("ETH Wallet")
    cy.contains("USD Wallet")
    cy.contains("-0.00010000 BTC")
  })
})
