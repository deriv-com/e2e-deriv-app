const createDemoAccounts = (isMobile = false) => {
  //Demo Mt5 account
  if (isMobile) cy.findByRole('button', { name: 'CFDs' }).click()
  cy.findByTestId('dt_trading-app-card_demo_standard')
    .findByRole('button', { name: 'Get' })
    .click()
  cy.findByText('Create a Deriv MT5 password').should('be.visible')
  cy.findByText(
    'You can use this password for all your Deriv MT5 accounts.'
  ).should('be.visible')
  cy.findByRole('button', { name: 'Create Deriv MT5 password' }).should(
    'be.disabled'
  )
  cy.findByTestId('dt_mt5_password').type(
    Cypress.env('credentials').test.mt5User.PSWD,
    {
      log: false,
    }
  )
  cy.findByRole('button', { name: 'Create Deriv MT5 password' }).click()
  cy.get('.dc-modal-body').should(
    'contain.text',
    'Success!Your demo Deriv MT5 Standard account is ready'
  )
  cy.findByRole('button', { name: 'Continue' }).click()

  //Demo DerivX account
  cy.findByTestId('dt_trading-app-card_demo_deriv-x')
    .findByRole('button', { name: 'Get' })
    .click()
  cy.findByText('Create a Deriv X password').should('be.visible')
  cy.findByRole('button', { name: 'Create Deriv X password' }).should(
    'be.disabled'
  )
  cy.findByTestId('dt_dxtrade_password').type(
    Cypress.env('credentials').test.mt5User.PSWD,
    {
      log: false,
    }
  )
  cy.findByRole('button', { name: 'Create Deriv X password' }).click()
  cy.get('.dc-modal-body').should('contain.text', 'Congratulations')
  cy.findByRole('button', { name: 'Continue' }).click()
}

const createRealAccounts = (isMobile = false) => {
  //Real Mt5 account
  if (isMobile) cy.findByRole('button', { name: 'CFDs' }).click()
  cy.findByTestId('dt_trading-app-card_real_standard')
    .findByRole('button', { name: 'Get' })
    .click()
  cy.findByText('St. Vincent & Grenadines').click()
  cy.findByRole('button', { name: 'Next' }).click()
  cy.findByText('Enter your Deriv MT5 password').should('be.visible')
  cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
  cy.findByTestId('dt_mt5_password').type(
    Cypress.env('credentials').test.mt5User.PSWD,
    {
      log: false,
    }
  )
  cy.findByRole('button', { name: 'Add account' }).click()
  cy.get('.dc-modal-body').should(
    'contain.text',
    'Success!Your Deriv MT5 Standard account is ready. Enable trading with your first transfer.'
  )
  cy.findByRole('button', { name: 'Maybe later' }).click()

  //Real Deriv X account
  cy.findByTestId('dt_trading-app-card_real_deriv-x')
    .findByRole('button', { name: 'Get' })
    .click()
  cy.findByText('Enter your Deriv X password').should('be.visible')
  cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
  cy.findByTestId('dt_dxtrade_password').type(
    Cypress.env('credentials').test.mt5User.PSWD,
    {
      log: false,
    }
  )
  cy.findByRole('button', { name: 'Add account' }).click()
  cy.get('.dc-modal-body').should('contain.text', 'Congratulations')
  cy.findByRole('button', { name: 'Maybe later' }).click()
}

const createSiblingAcct = (acctCount) => {
  cy.findByTestId('dt_currency-switcher__arrow').click()
  cy.findByRole('button', { name: 'Add or manage account' }).click()
  cy.get('.currency-list__item').eq(acctCount).click()
  cy.findByRole('button', { name: 'Add account' }).click()
  cy.findByRole('heading', { name: 'Success!' }).should('be.visible')
  cy.findByRole('button', { name: 'Deposit now' }).should('be.enabled')
  cy.findByRole('button', { name: 'Maybe later' }).click()
}

const getCurrencyList = () => {
  return cy
    .get('div.currency-list__items')
    .find('label')
    .then(($labels) => {
      const labelCount = $labels.length
      return labelCount
    })
}

describe('QATEST-54234 - Validate the Total assets for account having crypto siblings accounts', () => {
  it('Should check the Total assets for account having crypto siblings and cfd accounts', () => {
    let totalUSD = 0
    cy.c_createCRAccount({ country_code: 'co' })
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.c_uiLogin('large', username, pswd)
    cy.findByText('Total assets').should('be.visible')
    cy.c_switchToDemo()
    //Wait for page to completely load
    cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
    createDemoAccounts()
    cy.findAllByTestId('dt_balance_text_container')
      .eq(1)
      .invoke('text')
      .then((demoAccountBalance) => {
        const demoAccountBalanceAmount = parseFloat(
          demoAccountBalance.replace(/[^0-9.-]+/g, '')
        )
        cy.findAllByTestId('dt_account-balance')
          .eq(0)
          .invoke('text')
          .then((mt5AccountBalance) => {
            const mt5AccountBalanceAmount = parseFloat(
              mt5AccountBalance.replace(/[^0-9.-]+/g, '')
            )

            cy.findAllByTestId('dt_account-balance')
              .eq(1)
              .invoke('text')
              .then((derivXAccountBalance) => {
                const derivXAccountBalanceAmount = parseFloat(
                  derivXAccountBalance.replace(/[^0-9.-]+/g, '')
                )
                cy.findAllByTestId('dt_balance_text_container')
                  .eq(0)
                  .invoke('text')
                  .then((totalBalance) => {
                    const totalBalanceAmount = parseFloat(
                      totalBalance.replace(/[^0-9.-]+/g, '')
                    )
                    const expectedSum =
                      mt5AccountBalanceAmount +
                      demoAccountBalanceAmount +
                      derivXAccountBalanceAmount
                    expect(expectedSum).to.equal(totalBalanceAmount)
                  })
              })
          })
      })
    cy.c_switchToReal()
    cy.findByText('Total assets').should('be.visible')
    cy.c_closeNotificationHeader()
    createRealAccounts()
    cy.findAllByTestId('dt_account-balance')
      .eq(0)
      .invoke('text')
      .then((mt5AccountBalance) => {
        const mt5AccountBalanceAmount = parseFloat(
          mt5AccountBalance.replace(/[^0-9.-]+/g, '')
        )
        cy.findAllByTestId('dt_account-balance')
          .eq(1)
          .invoke('text')
          .then((derivXAccountBalance) => {
            const derivXAccountBalanceAmount = parseFloat(
              derivXAccountBalance.replace(/[^0-9.-]+/g, '')
            )

            totalUSD = mt5AccountBalanceAmount + derivXAccountBalanceAmount
          })
      })
    cy.findByTestId('dt_currency-switcher__arrow').click()
    cy.findByRole('button', { name: 'Add or manage account' }).click()
    getCurrencyList().then((labelCount) => {
      cy.findByTestId('dt_modal_close_icon').click()
      for (let acctCount = 0; acctCount < labelCount; acctCount++) {
        createSiblingAcct(acctCount)
      }
    })
    cy.findByTestId('dt_currency-switcher__arrow').click()
    cy.request(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd'
    ).then((response) => {
      cy.log('API CALL !!!!!!!!!')
      const exchangeRates = response.body

      const currencyMapping = {
        BTC: 'bitcoin',
        ETH: 'ethereum',
        LTC: 'litecoin',
      }

      cy.findAllByTestId('dt_balance_text_container')
        .eq(0)
        .invoke('text')
        .then((balanceText) => {
          const totalBalance = parseFloat(balanceText.replace(',', ''))
          cy.log(`Total Balance value: ${totalBalance}`)

          cy.get('.currency-item-card__balance')
            .each(($element) => {
              cy.wrap($element)
                .find('[data-testid="dt_span"]')
                .invoke('text')
                .then((text) => {
                  const [value, currency] = text.trim().split(' ')
                  const apiCurrency = currencyMapping[currency]
                  const numericValue = parseFloat(value.replace(',', ''))
                  const usdValue =
                    apiCurrency !== 'USD' && exchangeRates[apiCurrency]
                      ? numericValue * exchangeRates[apiCurrency].usd
                      : numericValue
                  totalUSD += usdValue
                  totalUSD = Math.round(totalUSD * 100) / 100
                  cy.log(`Total USD value: ${totalUSD}`)
                })
            })
            .then(() => {
              const isWithinRange =
                totalUSD >= totalBalance - 0.1 && totalUSD <= totalBalance + 0.1
              expect(isWithinRange).to.be.true
            })
        })
    })
  })
})
