import '@testing-library/cypress/add-commands'

describe('QATEST-54234 - Validate the Total assets for account having crypto siblings accounts', () => {
  it('Should check the Total assets for account having crypto siblings accounts', () => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.c_switchToReal()
    cy.findByText('Total assets').should('be.visible')
    cy.c_closeNotificationHeader()
    cy.findByTestId('dt_currency-switcher__arrow').click()

    cy.request(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd'
    ).then((response) => {
      const exchangeRates = response.body
      let totalUSD = 0

      const currencyMapping = {
        BTC: 'bitcoin',
        ETH: 'ethereum',
        LTC: 'litecoin',
      }

      cy.get('.currency-item-card__balance')
        .each(($element) => {
          cy.wrap($element)
            .find('[data-testid="dt_span"]')
            .invoke('text')
            .then((text) => {
              const [value, currency] = text.trim().split(' ')
              cy.log(`value: ${value}`)
              cy.log(`currency: ${currency}`)
              const apiCurrency = currencyMapping[currency]
              cy.log(`apiCurrency: ${apiCurrency}`)
              const numericValue = parseFloat(value.replace(',', ''))
              cy.log(`numericValue : ${numericValue}`)
              const usdValue =
                apiCurrency !== 'USD' && exchangeRates[apiCurrency]
                  ? numericValue * exchangeRates[apiCurrency].usd
                  : numericValue
              cy.log(`usdValue : ${usdValue}`)
              totalUSD += usdValue
            })
        })
        .then(() => {
          cy.log(`Total USD value: ${totalUSD}`)
        })
    })
  })
})
