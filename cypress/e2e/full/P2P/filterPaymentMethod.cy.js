import '@testing-library/cypress/add-commands'
import { generateAccountNumberString } from '../../../support/helper/utility'

let paymentID = generateAccountNumberString(12)

function verifyOnePaymentMethod(orderTab, PM1, NonSelectedPM) {
  cy.findByRole('button', { name: orderTab }).click()
  const buttonText = orderTab === 'Sell' ? 'Sell USD' : 'Buy USD'
  cy.findByTestId('dt_initial_loader').should('not.exist')
  cy.get('body', { timeout: 10000 }).then((body) => {
    if (body.find('.no-ads__message', { timeout: 10000 }).length > 0) {
      cy.findByText('No ads for this currency 😞')
    } else {
      cy.contains(PM1).should('exist')
      cy.contains(NonSelectedPM).should('not.exist')
    }
  })
}

function verifyTwoPaymentMethod(orderTab, PM1, PM2, NonSelectedPM) {
  cy.findByRole('button', { name: orderTab }).click()
  const buttonText = orderTab === 'Sell' ? 'Sell USD' : 'Buy USD'
  cy.contains('button', buttonText)
    .its('length')
    .then((length) => {
      if (length === 0) {
        cy.findByText('No ads for this currency 😞')
      } else {
        cy.contains(PM1)
        cy.contains(PM2)
        cy.contains(NonSelectedPM).should('not.exist')
      }
    })
}

function verifyAllPaymentMethod(orderTab, PM1, PM2) {
  cy.findByRole('button', { name: orderTab }).click()
  cy.contains(PM1)
  cy.contains(PM2)
}

function redirectToP2PMyAdTab(email) {
  cy.c_login({ user: email })
  cy.c_visitResponsive('/appstore/traders-hub', 'small')
  cy.c_navigateToDerivP2P()
  cy.c_skipPasskey()
  cy.c_closeNotificationHeader()
  cy.c_clickMyAdTab()
}

function addOrderWithPM() {
  addSellOrderDetails('Other', '10', '0.1', '1', '2')
  cy.findByRole('button', { name: 'Create new ad' })
    .should('be.enabled')
    .click()
  addSellOrderDetails('Skrill', '20', '0.2', '10.1', '10.2')
  cy.findByRole('button', { name: 'Create new ad' })
    .should('be.enabled')
    .click()
  addBuyOrderDetails('Bank Transfer', '10', '1', '0.01', '0.02')
  cy.findByRole('button', { name: 'Create new ad' })
    .should('be.enabled')
    .click()
  addBuyOrderDetails('PayPal', '20', '2', '10.01', '10.02')
  cy.findByRole('button', { name: 'Create new ad' })
    .should('be.visible')
    .click()
}

function addBuyOrderDetails(paymentMethod, amount, rate, min, max) {
  cy.findByTestId('offer_amount').click().type(amount)
  cy.findByTestId('fixed_rate_type').type(rate)
  cy.findByTestId('min_transaction').click().type(min)
  cy.findByTestId('max_transaction').click().type(max)
  cy.findByRole('button', { name: 'Next' }).should('be.enabled').click()
  cy.findByPlaceholderText('Add').should('be.visible').click()
  cy.findByText(paymentMethod).click()
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
  })
  it('Filter for Payment Methods - Buy/Sell Ad', () => {
    redirectToP2PMyAdTab('p2pFloating')
    cy.c_createNewAd('sell')
    addOrderWithPM()
    redirectToP2PMyAdTab('p2pSortFunctionality')
    cy.findByText('Buy / Sell').should('be.visible').click()
    cy.findByTestId('sort-div').next().click()
    cy.c_filterByPaymentMethod('Bank Transfer')
    verifyOnePaymentMethod('Buy', 'Bank Transfer', 'Other')
    verifyOnePaymentMethod('Sell', 'Bank Transfer', 'Other')
    cy.findByTestId('sort-div').next().click()
    cy.c_filterByPaymentMethod('Other')
    verifyOnePaymentMethod('Buy', 'Other', 'AliPay')
    verifyOnePaymentMethod('Sell', 'Bank Transfer', 'AliPay')
    cy.c_resetFilter()
    cy.c_filterByPaymentMethod('Skrill')
    verifyOnePaymentMethod('Buy', 'Skrill', 'Bank Transfer')
    verifyOnePaymentMethod('Sell', 'Skrill', 'Bank Transfer')
    cy.findByTestId('sort-div').next().click()
    cy.c_filterByPaymentMethod('Other')
    verifyTwoPaymentMethod('Buy', 'Other', 'Skrill', 'Bank Transfer')
    cy.c_resetFilter()
    cy.findByRole('button', { name: 'Apply' }).should('be.enabled').click()
    verifyAllPaymentMethod('Buy', 'Other', 'Skrill')
    verifyAllPaymentMethod('Sell', 'PayPal', 'Bank Transfer')
  })
})
