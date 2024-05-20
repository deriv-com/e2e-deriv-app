import '@testing-library/cypress/add-commands'

function filterByPaymentMethod(PM) {
  cy.findByText('Payment methods').should('be.visible').click()
  cy.get('label').should('have.length', 7)
  cy.findByText(PM).should('be.visible').click()
  cy.findByRole('button', { name: 'Confirm' }).should('be.enabled').click()
  cy.findByRole('button', { name: 'Apply' }).should('be.enabled').click()
}

function resetFilter() {
  cy.findByTestId('sort-div').next().click()
  cy.findByRole('button', { name: 'Reset' }).should('be.enabled').click()
}

function verifyNoPaymentMethod(orderTab) {
  cy.findByRole('button', { name: orderTab }).click()
  cy.findByText('No ads for this currency 😞')
}

function verifyOnePaymentMethod(orderTab, PM1) {
  cy.findByRole('button', { name: orderTab }).click().contains(PM1)
}

function verifyTwoPaymentMethod(orderTab, PM1, PM2) {
  cy.findByRole('button', { name: orderTab })
    .click()
    .contains(PM1)
    .contains(PM2)
}

describe('QATEST-2853 - Ad details', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.c_login({ user: 'p2pFloating' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })
  it('Filter for Payment Methods - Buy/Sell Ad', () => {
    cy.c_navigateToDerivP2P()
    cy.c_skipPasskey()
    cy.findByText('Deriv P2P').should('exist')
    cy.c_closeNotificationHeader()
    resetFilter()
    filterByPaymentMethod('Bank Transfer')
    verifyNoPaymentMethod('Buy')
    verifyOnePaymentMethod('Sell', 'Bank Transfer')
    cy.findByTestId('sort-div').next().click()
    filterByPaymentMethod('Other')
    verifyOnePaymentMethod('Buy', 'Other')
    verifyOnePaymentMethod('Sell', 'Bank Transfer')
    resetFilter()
    filterByPaymentMethod('Skrill')
    verifyOnePaymentMethod('Buy', 'Skrill')
    verifyNoPaymentMethod('Sell')
    filterByPaymentMethod('Other')
    verifyTwoPaymentMethod('Buy', 'Other', 'Skrill')
    verifyNoPaymentMethod('Sell')
    resetFilter()
    verifyOnePaymentMethod('Sell', 'Bank Transfer')
    verifyTwoPaymentMethod('Buy', 'Other', 'Skrill')
  })
})
