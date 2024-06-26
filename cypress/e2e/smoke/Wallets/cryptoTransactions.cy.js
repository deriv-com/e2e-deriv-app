function checkTranferExchangeRate(to_account, transferAmount) {
  cy.get('input[class="wallets-atm-amount-input__input"]')
    .eq(2)
    .invoke('val')
    .then((val) => {
      cy.log(`Converted Amount is: ${val}`)
      cy.getCurrentExchangeRate(
        'BTC',
        to_account.split(' ')[0],
        transferAmount
      ).then((finalRate) => {
        cy.log(`EXCHANGE RATE IS: ${finalRate}`)
        const getFivePercentValueOfCurrentExchangeRate = 0.1 * finalRate
        const getMinimumFivePercentOfCurrentExchangeRate =
          finalRate - getFivePercentValueOfCurrentExchangeRate
        cy.log(`Mimnimum is: ${getMinimumFivePercentOfCurrentExchangeRate}`)
        const getMaximumFivePercentOfCurrentExchangeRate =
          finalRate + getFivePercentValueOfCurrentExchangeRate
        cy.log(`Maximum is: ${getMaximumFivePercentOfCurrentExchangeRate}`)
        const TransferValue = parseFloat(val.split(' ')[0])
        expect(TransferValue).to.be.greaterThan(
          getMinimumFivePercentOfCurrentExchangeRate
        )
        expect(TransferValue).to.be.gte(
          parseFloat(getMaximumFivePercentOfCurrentExchangeRate)
        )
      })
    })
}
function crypto_transfer(to_account, transferAmount) {
  cy.findByText('Transfer to').click()
  cy.findByText(`${to_account}`).click()
  cy.get('input[class="wallets-atm-amount-input__input"]')
    .eq(1)
    .click()
    .type(transferAmount)
  cy.wait(1000) // to sget transfer amount
  if (to_account == 'USD Wallet') {
    cy.contains(
      'lifetime transfer limit from BTC Wallet to any fiat Wallets is'
    )
    checkTranferExchangeRate(to_account, transferAmount)
  } else {
    if (to_account == 'Options') {
      cy.contains('transfer limit between your BTC Wallet and Options')
    } else {
      cy.contains('lifetime transfer limit between cryptocurrency Wallets is')
    }
  }

  cy.get('form')
    .findByRole('button', { name: 'Transfer', exact: true })
    .should('be.enabled')
    .click()
  cy.c_transferLimit(transferAmount)
  if (`${to_account}` != 'Options') {
    cy.contains('Transfer fees:')
  }

  cy.findByRole('button', { name: 'Make a new transfer' }).click()
}

describe('QATEST-98789 - Transfer to crypto accounts and QATEST-98794 View Crypto transactions and QATEST-99429 Transfer conversion rate and QATEST-99714 Life time transfer limit message', () => {
  //Prerequisites: Crypto wallet account in any qa box with 1.00000000 BTC balance and USD, ETH and LTC wallets
  let transferAmount = '0.00003000'
  beforeEach(() => {
    Cypress.prevAppId = 0
    cy.c_login({ user: 'walletloginEmail' })
  })

  it(
    'should be able to perform transfer from crypto account',
    { scrollBehavior: false },
    () => {
      cy.log('Transfer from Crypto account')
      cy.findByText(/Wallet/, { timeout: 10000 }).should('exist')
      cy.c_visitResponsive('/', 'large')
      cy.c_setupTradeAccount('BTC', false)
      cy.c_switchWalletsAccount('BTC')
      cy.contains('Transfer').click()
      crypto_transfer('USD Wallet', transferAmount)
      crypto_transfer('ETH Wallet', transferAmount)
      crypto_transfer('LTC Wallet', transferAmount)
      crypto_transfer('Options', transferAmount)
    }
  )

  it('should be able to view transactions of crypto account', () => {
    cy.log('View Transactions of Crypto account')
    cy.c_visitResponsive('/', 'large')
    cy.findByText(/Wallet/, { timeout: 10000 }).should('exist')
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
    cy.contains(`-${transferAmount}`).first().should('be.visible')
  })

  it('should be able to perform transfer from crypto account in responsive', () => {
    cy.log('Transfer from Crypto account')
    cy.c_visitResponsive('/', 'small')
    cy.findAllByText("Trader's Hub").should('have.length', '1')
    cy.c_WaitUntilPageIsLoaded()
    cy.c_skipPasskeysV2()
    cy.c_rateLimit({ waitTimeAfterError: 15000, maxRetries: 5 })
    cy.c_switchWalletsAccountResponsive('BTC')
    cy.contains('Transfer').parent().click()
    crypto_transfer('USD Wallet', transferAmount)
    crypto_transfer('ETH Wallet', transferAmount)
    crypto_transfer('LTC Wallet', transferAmount)
    crypto_transfer('Options', transferAmount)
  })

  it('should be able to view transactions of crypto account in responsive', () => {
    cy.log('View Transactions of Crypto account')
    cy.c_visitResponsive('/', 'small')
    cy.c_WaitUntilPageIsLoaded()
    cy.c_skipPasskeysV2()
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
    cy.findAllByText(/Options/)
      .first()
      .should('be.visible')
    cy.contains(`-${transferAmount}`).first().should('be.visible')
  })
})
