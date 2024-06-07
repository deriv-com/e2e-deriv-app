import '@testing-library/cypress/add-commands'

const stakeAmount = '5'

describe('QATEST-6332 -  Verify contract for Digits', () => {
  const select = ['even', 'odd']
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/', 'small')
    cy.wait(4000)
    cy.c_skipPasskeysV2()
    cy.findByTestId('dt_trading-app-card_real_deriv-trader')
      .findByRole('button', { name: 'Open' })
      .click({ force: true })
  })

  select.forEach((select) => {
    it(`Should buy ${select == 'even' ? 'Even' : 'Odd'} contract from Even/Odd Trade Type`, () => {
      const evenOdd = select == 'even' ? true : false
      const symbol = 'Volatility 100 (1s) Index'

      cy.c_visitResponsive('/', 'small')
      cy.wait(4000)
      cy.c_skipPasskeysV2()
      cy.findByTestId('dt_trading-app-card_real_deriv-trader')
        .findByRole('button', { name: 'Open' })
        .click({ force: true })

      cy.c_selectDemoAccount()
      cy.c_selectSymbol(symbol, 'mobile')
      cy.c_selectTradeType('Options', 'Even/Odd')
      cy.c_validateDurationDigitsResponsive('Even/Odd')
      cy.c_checkDigitStatsChartsAndStakePayoutError()
      cy.c_inputStakeAmountMobile()
      if (evenOdd) cy.c_placeEvenorOddTradetype('Even')
      else cy.c_placeEvenorOddTradetype('Odd')
      cy.c_validateContractNotification(symbol, stakeAmount)
      cy.c_checkRecentPositionIconAndOpenPosition(stakeAmount)
      cy.c_checkContractDetailsPageMobile(stakeAmount)
    })
  })
})
