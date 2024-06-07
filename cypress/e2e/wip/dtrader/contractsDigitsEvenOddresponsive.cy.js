import '@testing-library/cypress/add-commands'

const clearStakeField = () => {
  cy.findByRole('button', { name: '⌫' }).then(($button) => {
    if (!$button.is(':disabled')) {
      cy.wrap($button)
        .click()
        .then(() => {
          clearStakeField()
        })
    }
  })
}
const stakeAmount = '5'

function validateDigitStatsCharts() {
  cy.get('.digits--trade').should('be.visible')
  cy.get('.dc-swipeable__nav__item').eq(1).should('be.visible').click()
  cy.get('.chartContainer').should('be.visible')
  cy.get('.dc-swipeable__nav__item').eq(0).should('be.visible').click()
  cy.get('.digits--trade').should('be.visible')
  cy.get('.digits__toast-info').should('be.visible')
}
function validateStakePayoutErrorMessage() {
  cy.findByRole('button', { name: 'Stake' }).click()
  cy.findByTestId('dt_themed_scrollbars').findByText('Payout').click()
  cy.findByTestId('dt_themed_scrollbars').findByText('Stake').click()
  clearStakeField()
  cy.findByText('Should not be 0 or empty').should('be.visible')
  cy.findByTestId('dt_themed_scrollbars')
    .findByRole('button', { name: '0' })
    .click()
  cy.findByText('Should not be 0 or empty').should('be.visible')
  clearStakeField()
  cy.findByTestId('dt_themed_scrollbars')
    .findByRole('button', { name: '5' }) // Find and click the button with name "5"
    .click()

  for (let i = 0; i < 4; i++) {
    cy.findByTestId('dt_themed_scrollbars')
      .findByRole('button', { name: '0' })
      .click()
  }
  cy.findByRole('button', { name: 'OK' }).click()
  cy.get('.btn-purchase__error').should('be.visible')
  cy.findByRole('button', { name: 'Stake' }).click()
  cy.findByTestId('dt_themed_scrollbars').findByText('Payout').click()
  clearStakeField()
  cy.findByTestId('dt_themed_scrollbars')
    .findByRole('button', { name: '8' }) // Find and click the button with name "5"
    .click()

  for (let i = 0; i < 4; i++) {
    cy.findByTestId('dt_themed_scrollbars')
      .findByRole('button', { name: '0' })
      .click()
  }
  cy.findByRole('button', { name: 'OK' }).click()
  cy.get('.btn-purchase__error').should('be.visible')
  cy.findByRole('button', { name: 'Payout' }).click()
  //clearStakeField()
}

function inputStakeAmountMobile() {
  //cy.findByRole('button', { name: 'Stake' }).click()
  cy.findByTestId('dt_themed_scrollbars').findByText('Stake').click()
  clearStakeField()
  cy.findByTestId('dt_themed_scrollbars')
    .findByRole('button', { name: stakeAmount })
    .click()
  cy.findByRole('button', { name: 'OK' }).click()
}

function placeEvenorOddTradetype(tradeType) {
  if (tradeType == 'Even') {
    cy.get('button.btn-purchase.btn-purchase--1').click()
  } else if (tradeType == 'Odd') {
    cy.get('button.btn-purchase.btn-purchase--2').click()
  } else {
    cy.log('Please check trade type entered and locator')
  }
}

function checkContractDetailsPage() {
  cy.findByRole('link', { class: 'data-list__item--wrapper' }).click()
  cy.findByText('Contract details').should('be.visible')
  cy.contains('span[data-testid="dt_span"]', stakeAmount).should('be.visible') //verify stake amount
  cy.findByTestId('dt_handle_button').click()

  let buyReference, sellReference
  cy.get('#dt_id_label')
    .find('.contract-audit__value')
    .invoke('text')
    .then((text) => {
      const match = text.match(/(\d+) \(Buy\)/)
      if (match) {
        buyReference = match[1]
      }
    })
    .then(() => {
      cy.get('#dt_id_label')
        .find('.contract-audit__value2')
        .invoke('text')
        .then((text) => {
          const match = text.match(/(\d+) \(Sell\)/)
          if (match) {
            sellReference = match[1]
          }
        })
        .then(() => {
          cy.findByTestId('dt_positions_toggle').click()
          cy.findByRole('link', { name: 'Go to Reports' }).click()
          cy.c_checkTradeTablePageResponsive(buyReference)
          cy.c_checkStatementPageResponsive(buyReference, sellReference)
        })
    })
}

function validateContractNotification(symbol) {
  cy.contains('.swipeable-notification', stakeAmount).should('be.visible')
  cy.contains('.swipeable-notification', symbol).should('be.visible')
}
function validaterecentPositionIcon() {
  cy.findByTestId('dt_positions_toggle').click()
  cy.findByText('Even').should('be.visible')
  cy.findByRole('link', { name: 'Go to Reports' }).click()
}

function validateOpenPositionsPage() {
  cy.findByText('Ref. ID').should('be.visible')
  cy.findByText('Currency').should('be.visible')
  cy.contains('.data-list', stakeAmount).should('be.visible')
  cy.contains('.data-list', 'Contract value').should('be.visible')
  cy.contains('.data-list', 'Potential payout').should('be.visible')
  cy.contains('.data-list', 'Total profit/loss').should('be.visible')
  cy.contains('.data-list', 'Resale not offered').should('be.visible')
}

describe('QATEST-6332 -  Verify contract for Digits', () => {
  beforeEach(() => {
    cy.c_login()
    //cy.c_visitResponsive('', 'small')
    cy.c_visitResponsive('/dtrader', 'small')
    cy.wait(4000)
    cy.c_skipPasskeysV2()
    cy.findByTestId('dt_trading-app-card_real_deriv-trader')
      .findByRole('button', { name: 'Open' })
      .click({ force: true })
    //cy.c_visitResponsive('/dtrader', 'small')
    //cy.c_skipPasskeysV2()
  })
  it('Should buy Even contract from Even/Odd Trade Type', () => {
    const symbol = 'Volatility 100 (1s) Index'
    //cy.c_skipPasskeysV2()
    cy.c_selectDemoAccount()
    cy.c_selectSymbol(symbol, 'mobile')
    cy.c_selectTradeType('Options', 'Even/Odd')
    cy.c_validateDurationDigitsResponsive('Even/Odd')
    validateDigitStatsCharts()
    validateStakePayoutErrorMessage()
    inputStakeAmountMobile()
    placeEvenorOddTradetype('Even')
    validateContractNotification(symbol)
    validaterecentPositionIcon()
    validateOpenPositionsPage()
    checkContractDetailsPage()
  })

  it('Should buy Odd contract from Even/Odd Trade Type', () => {
    const symbol = 'Volatility 100 (1s) Index'
    cy.c_selectDemoAccount()
    cy.c_selectSymbol(symbol, 'mobile')
    cy.c_selectTradeType('Options', 'Even/Odd')
    cy.c_validateDurationDigitsResponsive('Even/Odd')
    validateDigitStatsCharts()
    validateStakePayoutErrorMessage()
    inputStakeAmountMobile()
    placeEvenorOddTradetype('Odd')
    validateContractNotification(symbol)
    validaterecentPositionIcon()
    validateOpenPositionsPage()
    checkContractDetailsPage()
  })
})
