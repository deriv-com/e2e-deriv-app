

let rate = 0.01
let marketRate
let rateCalculation
let calculatedValue
let regexPattern
const decimalPlacesToSkip = 1


Cypress.Commands.add('c_redirectToP2P', () => {
  // click on hamburger menu
  cy.get("#dt_mobile_drawer_toggle").should("be.visible")
  cy.get("#dt_mobile_drawer_toggle").click()
  // click on cashier 
  cy.get('.dc-mobile-drawer__body > :nth-child(4)').should("be.visible").click()
  // click on P2P 
  cy.findByText("Deriv P2P").should("be.visible").click()
  // confirm warning message
  cy.get('.dc-checkbox__box').should("be.visible").click()
  cy.findByRole("button", { name: "Confirm" }).click()
})

Cypress.Commands.add('c_createNewAd', () => {
  cy.findByTestId('dt_initial_loader').should('not.exist')
  cy.get('body', { timeout: 10000 }).then((body) => {
    // if (body.find('You have no ads').length > 0) {
      if (body.find('.no-ads__message',{ timeout: 10000 }).length > 0){
      cy.findByRole("button", { name: "Create new ad" }).should("be.visible").click()
    }
    else if (body.find('#toggle-my-ads',{ timeout: 10000 }).length > 0) {
    // else  {
      cy.c_removeExistingAds()
      cy.c_createNewAd()
    } 

  }) 
})

Cypress.Commands.add('c_ClickMyAdTab', () => {
  cy.get('.notification__close-button').should("be.visible").click()
  cy.findByText("My ads").should("be.visible").click()
})

Cypress.Commands.add('c_postBuyAd', () => {
  cy.findByTestId('offer_amount').click().type('10')
  cy.findByTestId('float_rate_type').click().clear().type(rate, { parseSpecialCharSequences: false })
  cy.findByTestId('min_transaction').click().clear().type('5')
  cy.findByTestId('max_transaction').click().clear().type('10')
  cy.c_addPaymentMethod()
  cy.c_postAd()

})

Cypress.Commands.add('c_verifyExchangeRate', () => {
  rateCalculation = rate * 0.01
  calculatedValue = rateCalculation * marketRate + marketRate
  regexPattern = new RegExp(`Your rate is = ${calculatedValue.toFixed(6 - decimalPlacesToSkip)}\\d{${decimalPlacesToSkip}} NZD`);
  cy.get('.floating-rate__hint').invoke('text').should('match', regexPattern);
})

Cypress.Commands.add('c_verifyRate', () => {
  cy.findByTestId('float_rate_type').click().clear()
  cy.findByText("Floating rate is required").should("be.visible")
  cy.findByTestId('float_rate_type').click().clear().type('abc')
  cy.findByText("Floating rate is required").should("be.visible")
  cy.findByTestId('float_rate_type').click().clear().type('10abc')
  cy.findByTestId('float_rate_type').invoke('val').should('eq', '10')
  cy.findByTestId('float_rate_type').click().clear().type('!@#')
  cy.findByText("Floating rate is required").should("be.visible")
  cy.findByTestId('float_rate_type').click().clear().type('1234')
  cy.findByText("Enter a value that's within -10.00% to +10.00%").should("be.visible")
  cy.findByTestId('float_rate_type').click().clear().type(rate, { parseSpecialCharSequences: false })
  cy.get('.floating-rate__mkt-rate').invoke('text').then((text) => {
    const match = text.match(/of the market rate1 USD = (\d+(\.\d+)?)/)
    marketRate = parseFloat(match[1])
    if (match) {
      cy.verifyExchangeRate
      // Verify clicking plus button twice 
      cy.get('#floating_rate_input_add').click({ force: true }).click({ force: true })
      rate = rate + 0.02
      cy.verifyExchangeRate
      // // verify minus button once  
      cy.get('#floating_rate_input_sub').click({ force: true })
      rate = rate - 0.01
      cy.verifyExchangeRate
    }
    else {
      throw new Error('Text does not match the expected pattern');
    }

  })
})

Cypress.Commands.add('c_verifyPostAd', () => {
  cy.findByRole("button", { name: "Post ad" }).should("be.enabled").click()
  cy.findByText("You've created an ad").should("be.visible")
  // cy.findByText("If the ad doesn't receive an order for 3 days, it will be deactivated.").should("be.visible")
  cy.findByText("Don’t show this message again.").should("be.visible")
  cy.findByRole("button", { name: "Ok" }).should("be.enabled").click()
})

Cypress.Commands.add('c_verifyTooltip', () => {
  cy.findByTestId('dt_order_time_selection_info_icon').click()
  cy.contains("Orders will expire if they aren’t completed within this time.")
  cy.findByRole("button", { name: "Ok" }).click()
})

Cypress.Commands.add('c_verifyCompletionOrderDropdown', () => {
  cy.findByTestId('dt_dropdown_display').click()
  cy.get('#3600').should("be.visible")
  cy.get('#2700').should("be.visible")
  cy.get('#1800').should("be.visible")
  cy.get('#900').should("be.visible").click()
  
  // cy.xpath('//*[@id=900]').click()
})

Cypress.Commands.add('c_verifyMaxMin', (selector, expectedValue, expectedValidation) => {
  cy.findByTestId(selector).click().type('abc')
  cy.findByText("Only numbers are allowed.").should("be.visible")
  cy.findByTestId(selector).click().clear().type('123abc')
  cy.findByText("Only numbers are allowed.").should("be.visible")
  cy.findByTestId(selector).click().clear().type('!@#')
  cy.findByText("Only numbers are allowed.").should("be.visible")
  cy.findByTestId(selector).click().clear().type('1234567890123456')
  cy.findByTestId(selector).should('have.value', '123456789012345')
  cy.findByTestId(selector).click().clear()
  cy.findByText(`${expectedValidation} limit is required`).should("be.visible")
  cy.findByTestId(selector).click().type('11')
  cy.findByText(`Amount should not be below ${expectedValidation} limit`).should("be.visible")
  cy.findByText(`${expectedValidation} limit should not exceed Amount`).should("be.visible")
  cy.findByTestId(selector).click().clear().type(expectedValue)
})

Cypress.Commands.add('c_addPaymentMethod', () => {
  cy.findByPlaceholderText('Add').click()
  cy.findByText('Other').click()
  cy.findByPlaceholderText('Add').click()
  cy.findByText('Bank Transfer').click()
  cy.findByPlaceholderText('Add').click()
  cy.findByText('Skrill').click()
  cy.findByPlaceholderText('Add').should('not.be.exist')
})

Cypress.Commands.add('c_verifyAmountFiled', () => {
  cy.findByTestId('offer_amount').click().type('abc')
  cy.findByText("Enter a valid amount").should("be.visible")
  cy.findByTestId('offer_amount').click().clear().type('123abc')
  cy.findByText("Enter a valid amount").should("be.visible")
  cy.findByTestId('offer_amount').click().clear().type('!@#')
  cy.findByText("Enter a valid amount").should("be.visible")
  cy.findByTestId('offer_amount').click().clear().type('1234567890123456')
  cy.findByTestId('offer_amount').should('have.value', '123456789012345')
  cy.findByTestId('offer_amount').click().clear()
  cy.findByText("Amount is required").should("be.visible")
  cy.findByTestId('offer_amount').click().type('10')
})

Cypress.Commands.add('c_postAd', () => {
  cy.findByRole("button", { name: "Post ad" }).should("be.enabled").click()
  cy.findByRole("button", { name: "Ok" }).should("be.enabled").click()
})

Cypress.Commands.add('c_removeExistingAds', () => {
  cy.get('.my-ads-table__row').trigger('touchstart', 'right', { timeout: 1000 }).trigger('touchmove', 'left').trigger('touchend')
  cy.get('.my-ads-table__popovers-delete>svg').click({ force: true })
  cy.findByText("Do you want to delete this ad?").should("be.visible")
  cy.findByText("You will NOT be able to restore it.").should("be.visible")
  cy.findByRole("button", { name: "Delete" }).should("be.enabled").click()
})

Cypress.Commands.add('c_verifyDynamicMsg', () => {
  cy.get('.message-selector').should('be.visible').invoke('text').then((messageText) => {
    const messagePattern = /If the ad doesn't receive an order for \d+ days, it will be deactivated./
    expect(messageText).to.match(messagePattern);
  })
})