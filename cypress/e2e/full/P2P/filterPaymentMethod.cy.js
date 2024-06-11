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
  cy.findByTestId('dt_initial_loader').should('not.exist')
  cy.get('body', { timeout: 10000 }).then((body) => {
    if (body.find('.no-ads__message', { timeout: 10000 }).length > 0) {
      cy.findByText('No ads for this currency 😞')
    } else {
      cy.contains(PM1).should('exist')
      cy.contains(PM2).should('exist')
      cy.contains(NonSelectedPM).should('not.exist')
    }
  })
}

function verifyAllPaymentMethod(orderTab, PM1, PM2) {
  cy.findByRole('button', { name: orderTab }).click()
  cy.contains(PM1)
  cy.contains(PM2)
}

function addOrderWithPM() {
  cy.c_addSellOrderDetails('Other', '10', '0.1', '1', '2')
  cy.findByRole('button', { name: 'Create new ad' })
    .should('be.enabled')
    .click()
  cy.c_addSellOrderDetails('Skrill', '20', '0.2', '10.1', '10.2')
  cy.findByRole('button', { name: 'Create new ad' })
    .should('be.enabled')
    .click()
  cy.c_addBuyOrderDetails('Bank Transfer', '10', '1', '0.01', '0.02')
  cy.findByRole('button', { name: 'Create new ad' })
    .should('be.enabled')
    .click()
  cy.c_addBuyOrderDetails('PayPal', '20', '2', '10.01', '10.02')
  cy.findByRole('button', { name: 'Create new ad' })
    .should('be.visible')
    .click()
}

describe('QATEST-121392 - Filter for Payment Methods and Matching Ads', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.c_login({ user: 'p2pFilterPaymentMethodBase' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })
  it('Should filter for Payment Methods in Buy and Sell ad screen.', () => {
    cy.c_navigateToP2P()
    cy.c_clickMyAdTab()
    cy.c_createNewAd('sell')
    addOrderWithPM()
    cy.c_login({ user: 'p2pFilterPaymentMethodSelector' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
    cy.c_navigateToP2P()
    cy.c_clickMyAdTab()
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
    cy.get('.dc-toggle-switch__label').click()
    cy.findByRole('button', { name: 'Apply' }).should('be.enabled').click()
    verifyAllPaymentMethod('Buy', 'Other', 'Skrill')
    verifyAllPaymentMethod('Sell', 'PayPal', 'Bank Transfer')
  })
})
