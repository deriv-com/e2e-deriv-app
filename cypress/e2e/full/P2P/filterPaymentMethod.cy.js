import '@testing-library/cypress/add-commands'
import { generateAccountNumberString } from '../../../support/helper/utility'

let paymentID = generateAccountNumberString(12)

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
  cy.findByRole('button', { name: orderTab }).click()
  cy.contains(PM1).should('exist')
  cy.contains('PayPal').should('not.exist')
}

function verifyTwoPaymentMethod(orderTab, PM1, PM2) {
  cy.findByRole('button', { name: orderTab })
    .click()
    .contains(PM1)
    .contains(PM2)
}

function addOrderWithPM() {
  cy.c_navigateToDerivP2P()
  cy.c_skipPasskey()
  cy.c_closeNotificationHeader()
  cy.c_clickMyAdTab()
  cy.c_createNewAd('buy')
  addBuyOrderDetails('Bank Transfer', '10', '1', '0.01', '0.02')
  cy.findByRole('button', { name: 'Create new ad' })
    .should('be.enabled')
    .click()
  addBuyOrderDetails('PayPal', '20', '2', '10.01', '10.02')
  cy.c_createNewAd('sell')
  addSellOrderDetails('Other', '10', '0.1', '1', '2')
  cy.findByRole('button', { name: 'Create new ad' })
    .should('be.enabled')
    .click()
  addSellOrderDetails('Skrill', '20', '0.2', '10.1', '10.2')
}

function addBuyOrderDetails(PM, amount, rate, min, max) {
  cy.findByTestId('offer_amount').click().type(amount)
  cy.findByTestId('fixed_rate_type').type(rate)
  cy.findByTestId('min_transaction').click().type(min)
  cy.findByTestId('max_transaction').click().type(max)
  cy.findByRole('button', { name: 'Next' }).should('be.enabled').click()
  cy.findByPlaceholderText('Add').should('be.visible').click()
  cy.findByText(PM).click()
  cy.findByRole('button', { name: 'Next' }).should('be.enabled').click()
  cy.c_verifyPostAd()
}

function addSellOrderDetails(paymentMethod, amount, rate, min, max) {
  cy.get(':nth-child(2) > .dc-radio-group__circle').click()
  cy.findByTestId('offer_amount').click().type(amount)
  cy.findByTestId('fixed_rate_type').type(rate)
  cy.findByTestId('min_transaction').click().type(min)
  cy.findByTestId('max_transaction').click().type(max)
  cy.findByTestId('contact_info').click().type('Test')
  cy.findByRole('button', { name: 'Next' }).should('be.enabled').click()
  cy.get('body', { timeout: 10000 }).then((body) => {
    if (body.find(paymentMethod, { timeout: 10000 }).length > 0) {
      cy.contains(paymentMethod).click()
    } else {
      cy.findByTestId('dt_payment_method_card_add_icon')
        .should('be.visible')
        .click()
      cy.get('input[name="payment_method"]').click()
      cy.c_addPaymentMethod(paymentID, paymentMethod)
      cy.contains(paymentMethod).click()
    }
  })
  cy.findByRole('button', { name: 'Next' }).should('be.enabled').click()
  cy.c_verifyPostAd()
}

describe('QATEST-2853 - Ad details', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.c_login({ user: 'p2pFloating' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })
  it.skip('Filter for Payment Methods - Buy/Sell Ad', () => {
    addBuyOrderWithPM()
    cy.findByText('Buy / Sell').should('be.visible').click()
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
    cy.findByTestId('sort-div').next().click()
    filterByPaymentMethod('Other')
    verifyTwoPaymentMethod('Buy', 'Other', 'Skrill')
    verifyNoPaymentMethod('Sell')
    resetFilter()
    verifyOnePaymentMethod('Sell', 'Bank Transfer')
    verifyTwoPaymentMethod('Buy', 'Other', 'Skrill')
  })
  it('Filter for Payment Methods - Buy/Sell Ad', () => {
    addOrderWithPM()
    cy.c_login({ user: 'p2pStandardAccountWithAds' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
    cy.c_navigateToDerivP2P()
    cy.c_skipPasskey()
    cy.c_closeNotificationHeader()
    cy.c_clickMyAdTab()
    cy.findByText('Buy / Sell').should('be.visible').click()
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
    cy.findByTestId('sort-div').next().click()
    filterByPaymentMethod('Other')
    verifyTwoPaymentMethod('Buy', 'Other', 'Skrill')
    verifyNoPaymentMethod('Sell')
    resetFilter()
    verifyOnePaymentMethod('Sell', 'Bank Transfer')
    verifyTwoPaymentMethod('Buy', 'Other', 'Skrill')
  })
})
