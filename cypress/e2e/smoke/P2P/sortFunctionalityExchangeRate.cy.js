import '@testing-library/cypress/add-commands'

const verifySortFunctionality = (adType) => {
  cy.c_getExchangeRatesFromScreen(adType, { sortArray: true }).then(
    (initialRatesArray) => {
      cy.c_sortAdBy('Exchange rate')
      cy.c_getExchangeRatesFromScreen(adType, { sortArray: false }).then(
        (sortedRatesArray) => {
          cy.wrap(initialRatesArray).should(
            'deep.equal',
            sortedRatesArray,
            `${adType} ads should be sorted by Exchange Rate`
          )
        }
      )
    }
  )
}

describe('QATEST-2718 - Verify sorting of Buy and Sell ads by Exchange Rate', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
    cy.c_login({ user: 'p2pSortFunctionality' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('Should be able to sort Buy and Sell ads by Exchange Rate.', () => {
    cy.c_navigateToDerivP2P()
    cy.c_skipPasskey()
    cy.findByText('Deriv P2P').should('exist')
    cy.c_closeNotificationHeader()
    cy.c_rateLimit({
      waitTimeAfterError: 15000,
      isLanguageTest: true,
      maxRetries: 5,
    })
    verifySortFunctionality('Buy')
    verifySortFunctionality('Sell')
  })
})
