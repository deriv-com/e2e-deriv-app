import '@testing-library/cypress/add-commands'

let ratesArray = []
let ratesArrayAfterExchangeRateSort = []

describe('QATEST-2718 Sort Functionality (by Exchange Rate)', () => {
  beforeEach(() => {
    cy.c_login({ user: 'p2pSortFunctionality' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('Should be able to sort Buy and Sell ads by Exchange Rate.', () => {
    cy.c_navigateToDerivP2P()
    cy.c_closeSafetyInstructions()
    cy.findByText('Deriv P2P').should('exist')
    cy.c_closeNotificationHeader()
    cy.c_getExchngeRatesFromScreen('Buy').then((returnedRatesArray) => {
      ratesArray = returnedRatesArray
      cy.c_sortAdBy('Exchange rate')
      cy.c_getExchngeRatesFromScreen('Buy').then((sortedReturnedRatesArray) => {
        ratesArrayAfterExchangeRateSort = sortedReturnedRatesArray
        cy.wrap(ratesArray).should(
          'deep.equal',
          ratesArrayAfterExchangeRateSort
        )
      })
    })
    cy.c_getExchngeRatesFromScreen('Sell').then((returnedRatesArray) => {
      ratesArray = returnedRatesArray
      cy.c_sortAdBy('Exchange rate')
      cy.c_getExchngeRatesFromScreen('Sell').then(
        (sortedReturnedRatesArray) => {
          ratesArrayAfterExchangeRateSort = sortedReturnedRatesArray
          cy.wrap(ratesArray).should(
            'deep.equal',
            ratesArrayAfterExchangeRateSort
          )
        }
      )
    })
  })
})
