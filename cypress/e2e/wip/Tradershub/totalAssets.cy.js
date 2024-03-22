import '@testing-library/cypress/add-commands'

describe('QATEST-54234 - Validate the Total assets for account having crypto siblings accounts', () => {
  it('Should check the Total assets for account having crypto siblings accounts', () => {
    let totalUSD = 0
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')

    cy.c_switchToDemo()
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
    cy.log(`Total Balance with CFD Account: ${totalUSD}`)
    cy.findByTestId('dt_currency-switcher__arrow').click()
    cy.request(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd'
    ).then((response) => {
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
