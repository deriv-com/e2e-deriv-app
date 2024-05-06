import { generateAccountNumberString } from '../helper/utility'

let rate = 0.01
let marketRate
let rateCalculation
let calculatedValue
let regexPattern
const pm1 = 'Other'
const pm2 = 'Bank Transfer'
const pm3 = 'Skrill'

Cypress.Commands.add('c_createNewAd', (adType) => {
  cy.findByTestId('dt_initial_loader').should('not.exist')
  cy.get('body', { timeout: 10000 }).then((body) => {
    if (body.find('.no-ads__message', { timeout: 10000 }).length > 0) {
      cy.findByRole('button', { name: 'Create new ad' })
        .should('be.visible')
        .click()
    } else if (body.find('#toggle-my-ads', { timeout: 10000 }).length > 0) {
      cy.c_removeExistingAds(adType)
      cy.findByRole('button', { name: 'Create new ad' })
        .should('be.visible')
        .click()
    }
  })
})

Cypress.Commands.add('c_clickMyAdTab', () => {
  cy.findByText('My ads').should('be.visible').click()
})

Cypress.Commands.add('c_postBuyAd', () => {
  cy.findByTestId('offer_amount').click().type('10')
  cy.findByTestId('float_rate_type')
    .click()
    .clear()
    .type(rate, { parseSpecialCharSequences: false })
  cy.findByTestId('min_transaction').click().clear().type('5')
  cy.findByTestId('max_transaction').click().clear().type('10')
  cy.c_PaymentMethod()
  cy.c_postAd()
})

Cypress.Commands.add('c_verifyExchangeRate', (rate) => {
  rateCalculation = rate * 0.01
  calculatedValue = rateCalculation * marketRate + marketRate
  regexPattern = new RegExp(
    `Your rate is = ${calculatedValue.toFixed(6).slice(0, -1)}\\d? NZD`
  )
})

Cypress.Commands.add(
  'c_verifyFixedRate',
  (adType, totalAmount, fixedRateValue, fiatCurrency, localCurrency) => {
    totalAmount = totalAmount.toFixed(2)
    fixedRateValue = fixedRateValue.toFixed(2)
    cy.findByTestId('fixed_rate_type').clear()
    cy.findByText('Fixed rate is required').should('be.visible')
    cy.findByTestId('fixed_rate_type').type('abc').should('have.value', 'abc')
    cy.findByText('Enter a valid amount').should('be.visible')
    cy.findByTestId('fixed_rate_type')
      .clear()
      .type('10abc')
      .should('have.value', '10abc')
    cy.findByText('Enter a valid amount').should('be.visible')
    cy.findByTestId('fixed_rate_type')
      .clear()
      .type('!@#')
      .should('have.value', '!@#')
    cy.findByText('Enter a valid amount').should('be.visible')
    cy.findByTestId('fixed_rate_type').clear().type(fixedRateValue)
    const totalPrice = totalAmount * fixedRateValue
    regexPattern = `You\'re creating an ad to ${adType} ${totalAmount} ${fiatCurrency} for ${totalPrice.toFixed(2)} ${localCurrency} (${fixedRateValue} ${localCurrency}/${fiatCurrency})`
    cy.get('.create-ad-summary')
      .eq(0)
      .invoke('text')
      .then((spanText) => {
        expect(spanText).to.eq(regexPattern)
      })
  }
)

Cypress.Commands.add('c_verifyTextAreaBlock', (blockName) => {
  cy.c_verifyTextAreaLength(blockName, 0)
  cy.findByTestId(blockName).clear()
  if (blockName == 'contact_info') {
    cy.findByText('Contact details is required').should('be.visible')
  }
  cy.findByTestId(blockName).clear().type('abc').should('have.value', 'abc')
  cy.c_verifyTextAreaLength(blockName, 'abc'.length)
  let textLimitCheck = generateAccountNumberString(300)
  cy.findByTestId(blockName)
    .clear()
    .type(textLimitCheck)
    .should('have.value', textLimitCheck)
  cy.c_verifyTextAreaLength(blockName, textLimitCheck.length)
  cy.findByTestId(blockName)
    .clear()
    .type(textLimitCheck + '1')
    .should('have.value', textLimitCheck)
  cy.c_verifyTextAreaLength(blockName, textLimitCheck.length)
  cy.findByTestId(blockName)
    .clear()
    .type('Text area info block.')
    .should('have.value', 'Text area info block.')
  cy.c_verifyTextAreaLength(blockName, 'Text area info block.'.length)
})

Cypress.Commands.add('c_verifyTextAreaLength', (blockName, textLength) => {
  cy.findByTestId(blockName)
    .parents('.dc-input__wrapper')
    .find('.dc-input__footer .dc-input__counter')
    .should('contain.text', `${textLength}/300`)
})

Cypress.Commands.add('c_checkForExistingAds', () => {
  cy.c_loadingCheck()
  return cy.get('body', { timeout: 10000 }).then((body) => {
    if (body.find('.no-ads__message', { timeout: 10000 }).length > 0) {
      return false
    } else if (body.find('#toggle-my-ads', { timeout: 10000 }).length > 0) {
      return true
    }
  })
})

Cypress.Commands.add('c_verifyRate', () => {
  cy.findByTestId('float_rate_type').click().clear()
  cy.findByText('Floating rate is required').should('be.visible')
  cy.findByTestId('float_rate_type').click().clear().type('abc')
  cy.findByText('Floating rate is required').should('be.visible')
  cy.findByTestId('float_rate_type').click().clear().type('10abc')
  cy.findByTestId('float_rate_type').invoke('val').should('eq', '10')
  cy.findByTestId('float_rate_type').click().clear().type('!@#')
  cy.findByText('Floating rate is required').should('be.visible')
  cy.findByTestId('float_rate_type').click().clear().type('1234')
  cy.findByText("Enter a value that's within -10.00% to +10.00%").should(
    'be.visible'
  )
  cy.findByTestId('float_rate_type')
    .click()
    .clear()
    .type(rate, { parseSpecialCharSequences: false })
  cy.get('.floating-rate__mkt-rate')
    .invoke('text')
    .then((text) => {
      const match = text.match(/of the market rate1 USD = (\d+(\.\d+)?)/)
      marketRate = parseFloat(match[1])
      if (match) {
        cy.c_verifyExchangeRate(rate)
        // Verify clicking plus button twice
        cy.get('#floating_rate_input_add')
          .click({ force: true })
          .click({ force: true })
        rate = rate + 0.02
        cy.c_verifyExchangeRate(rate)
        // // verify minus button once
        cy.get('#floating_rate_input_sub').click({ force: true })
        rate = rate - 0.01
        cy.c_verifyExchangeRate(rate)
      } else {
        throw new Error('Text does not match the expected pattern')
      }
    })
})

Cypress.Commands.add('c_verifyPostAd', () => {
  cy.findByRole('button', { name: 'Post ad' }).should('be.enabled').click()
  cy.findByText("You've created an ad").should('be.visible')
  cy.findByText(
    "If the ad doesn't receive an order for 3 days, it will be deactivated."
  ).should('be.visible')
  cy.findByText('Don’t show this message again.').should('be.visible')
  cy.findByRole('button', { name: 'Ok' }).should('be.enabled').click()
})

Cypress.Commands.add('c_verifyTooltip', () => {
  cy.findByTestId('dt_order_time_selection_info_icon').click()
  cy.contains('Orders will expire if they aren’t completed within this time.')
  cy.findByRole('button', { name: 'Ok' }).click()
})

Cypress.Commands.add('c_verifyCompletionOrderDropdown', () => {
  cy.findByTestId('dt_dropdown_display').click()
  cy.get('#3600').should('be.visible')
  cy.get('#2700').should('be.visible')
  cy.get('#1800').should('be.visible')
  cy.get('#900').should('be.visible').click()
})

Cypress.Commands.add(
  'c_verifyMaxMin',
  (selector, expectedValue, expectedValidation) => {
    cy.findByTestId(selector).click().type('abc')
    cy.findByText('Only numbers are allowed.').should('be.visible')
    cy.findByTestId(selector).click().clear().type('123abc')
    cy.findByText('Only numbers are allowed.').should('be.visible')
    cy.findByTestId(selector).click().clear().type('!@#')
    cy.findByText('Only numbers are allowed.').should('be.visible')
    cy.findByTestId(selector).click().clear().type('1234567890123456')
    cy.findByTestId(selector).should('have.value', '123456789012345')
    cy.findByTestId(selector).click().clear()
    cy.findByText(`${expectedValidation} limit is required`).should(
      'be.visible'
    )
    cy.findByTestId(selector).click().type('11')
    cy.findByText(`Amount should not be below ${expectedValidation} limit`)
      .scrollIntoView()
      .should('be.visible')
    cy.findByText(`${expectedValidation} limit should not exceed Amount`)
      .scrollIntoView()
      .should('be.visible')
    cy.findByTestId(selector).click().clear().type(expectedValue)
  }
)

Cypress.Commands.add('c_PaymentMethod', () => {
  cy.findByPlaceholderText('Add').click()
  cy.findByText(pm1).click()
  cy.findByPlaceholderText('Add').click()
  cy.findByText(pm2).click()
  cy.findByPlaceholderText('Add').click()
  cy.findByText(pm3).click()
  cy.findByPlaceholderText('Add').should('not.exist')
})

Cypress.Commands.add('c_verifyAmountFiled', () => {
  cy.findByTestId('offer_amount').click().type('abc')
  cy.findByText('Enter a valid amount').should('be.visible')
  cy.findByTestId('offer_amount').click().clear().type('123abc')
  cy.findByText('Enter a valid amount').should('be.visible')
  cy.findByTestId('offer_amount').click().clear().type('!@#')
  cy.findByText('Enter a valid amount').should('be.visible')
  cy.findByTestId('offer_amount').click().clear().type('1234567890123456')
  cy.findByTestId('offer_amount').should('have.value', '123456789012345')
  cy.findByTestId('offer_amount').click().clear()
  cy.findByText('Amount is required').should('be.visible')
  cy.findByTestId('offer_amount').click().type('10')
})

Cypress.Commands.add('c_postAd', () => {
  cy.findByRole('button', { name: 'Post ad' }).should('be.enabled').click()
  cy.findByRole('button', { name: 'Ok' }).should('be.enabled').click()
})

Cypress.Commands.add('c_removeExistingAds', (adType) => {
  cy.get('.my-ads-table__row .dc-dropdown-container')
    .should('be.visible')
    .click()
  cy.findByText('Delete').parent().click()
  cy.findByText('Do you want to delete this ad?').should('be.visible')
  cy.findByText('You will NOT be able to restore it.').should('be.visible')
  cy.findByRole('button', { name: 'Delete' })
    .should('be.enabled')
    .click()
    .should('not.exist', {
      timeout: 10000,
    })
  if (adType == 'sell') {
    cy.findByText('My profile').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    cy.findByText('Payment methods').should('be.visible').click()
    cy.findByText('Payment methods').should('be.visible')
    cy.c_deleteAllPM()
    cy.findByRole('button', { name: /Add/ }).should('be.visible')
    cy.c_visitResponsive('/cashier/p2p', 'small')
    cy.c_clickMyAdTab()
  }
})

Cypress.Commands.add('c_verifyDynamicMsg', () => {
  cy.get('.message-selector')
    .should('be.visible')
    .invoke('text')
    .then((messageText) => {
      const messagePattern =
        /If the ad doesn't receive an order for \d+ days, it will be deactivated./
      expect(messageText).to.match(messagePattern)
    })
})

Cypress.Commands.add('c_navigateToDerivP2P', () => {
  cy.get('#dt_mobile_drawer_toggle').should('be.visible').click()
  cy.findByRole('heading', { name: 'Cashier' }).should('be.visible').click()
  cy.findByRole('link', { name: 'Deriv P2P' }).should('be.visible').click()
})

Cypress.Commands.add('c_deleteAllPM', () => {
  cy.document().then((doc) => {
    let paymentCard = doc.querySelector('.dc-dropdown__container')
    if (paymentCard) {
      cy.get('.dc-dropdown__container').first().click()
      cy.get('#delete').should('be.visible').click()
      cy.findByRole('button', { name: 'Yes, remove' })
        .should('be.visible')
        .click()
        .and('not.exist')
      paymentCard = null
      cy.then(() => {
        cy.c_deleteAllPM()
      })
    } else {
      cy.log('No PMs available')
    }
  })
})

Cypress.Commands.add('c_closeSafetyInstructions', () => {
  cy.findByRole('heading', { name: 'For your safety:' })
    .should('be.visible')
    .then(($title) => {
      if ($title.is(':visible')) {
        cy.get('.dc-checkbox__box').should('be.visible').click()
      }
    })
  cy.findByRole('button', { name: 'Confirm' }).should('be.visible').click()
  cy.c_skipPasskey()
})

Cypress.Commands.add('c_addPaymentMethod', (paymentID, paymentMethod) => {
  if (paymentMethod == 'Bank Transfer') {
    cy.findByRole('textbox', { name: 'Payment method' })
      .clear()
      .type(paymentMethod)
      .should('have.value', paymentMethod)
    cy.findByText(paymentMethod).click()
    cy.findByRole('textbox', { name: 'Account Number' })
      .clear()
      .type(paymentID)
      .should('have.value', paymentID)
    cy.findByRole('textbox', { name: 'SWIFT or IFSC code' })
      .clear()
      .type('9087')
      .should('have.value', '9087')
    cy.findByRole('textbox', { name: 'Bank Name' })
      .clear()
      .type('Banking Name')
      .should('have.value', 'Banking Name')
    cy.findByRole('textbox', { name: 'Branch' })
      .clear()
      .type('Branch number 42')
      .should('have.value', 'Branch number 42')
    cy.get('textarea[name="instructions"]')
      .type('Follow instructions.')
      .should('have.value', 'Follow instructions.')
    cy.findByRole('button', { name: 'Add' }).should('not.be.disabled').click()
    cy.findByText('Payment methods').should('be.visible')
    cy.findByText(paymentID).should('be.visible')
  } else if (
    paymentMethod === 'PayPal' ||
    paymentMethod === 'WeChat Pay' ||
    paymentMethod === 'Skrill' ||
    paymentMethod === 'Alipay'
  ) {
    cy.findByRole('textbox', { name: 'Payment method' })
      .clear()
      .type(paymentMethod)
      .should('have.value', paymentMethod)
    cy.findByText(paymentMethod).click()
    cy.get('input[name="account"]')
      .clear()
      .type(paymentID)
      .should('have.value', paymentID)
    cy.get('textarea[name="instructions"]')
      .type('Follow instructions.')
      .should('have.value', 'Follow instructions.')
    cy.findByRole('button', { name: 'Add' }).should('not.be.disabled').click()
    cy.findByText('Payment methods').should('be.visible')
    cy.findByText(paymentID).should('be.visible')
  } else if (paymentMethod == 'Other') {
    cy.findByRole('textbox', { name: 'Payment method' })
      .clear()
      .type(paymentMethod)
      .should('have.value', paymentMethod)
    cy.findByText(paymentMethod).click()
    cy.findByRole('textbox', { name: 'Account ID / phone number / email' })
      .clear()
      .type(paymentID)
      .should('have.value', paymentID)
    cy.findByRole('textbox', { name: 'Payment method name' })
      .clear()
      .type(paymentMethod)
      .should('have.value', paymentMethod)
    cy.get('textarea[name="instructions"]')
      .type('Follow instructions.')
      .should('have.value', 'Follow instructions.')
    cy.findByRole('button', { name: 'Add' }).should('not.be.disabled').click()
    cy.findByText('Payment methods').should('be.visible')
    cy.findByText(paymentID).should('be.visible')
  }
})

Cypress.Commands.add('c_deletePaymentMethod', (paymentID, paymentName) => {
  cy.findByText(paymentID)
    .should('exist')
    .parent()
    .prev()
    .find('.dc-dropdown-container')
    .and('exist')
    .click()
  cy.get('#delete').should('be.visible').click()
  cy.findByText(`Delete ${paymentName}?`).should('be.visible')
  cy.findByRole('button', { name: 'Yes, remove' }).should('be.visible').click()
  cy.findByText(paymentID).should('not.exist')
})

Cypress.Commands.add('c_skipPasskey', (adType) => {
  cy.findByTestId('dt_initial_loader').should('not.exist')
  cy.get('body', { timeout: 10000 }).then((body) => {
    if (
      body.find(':contains("Effortless login with passkeys")', {
        timeout: 10000,
      }).length > 0
    ) {
      cy.findByText('Maybe later').click()
      cy.c_navigateToDerivP2P()
    } else if (
      body.find(':contains("Deriv P2P")', { timeout: 10000 }).length > 0
    ) {
      cy.log('Passkey is disable')
    }
  })
})

Cypress.Commands.add('c_verifyBuyAds', () => {
  cy.findByText('Active').should('be.visible')
  cy.findByText('Buy USD').should('be.visible')
  cy.findByText('Float').should('be.visible')
  cy.findByText('+0.02%').should('be.visible')
  cy.findByText(5 + '.00 - ' + 10 + '.00 USD')
  cy.contains(pm1)
  cy.contains(pm2)
  cy.contains(pm3)
})

Cypress.Commands.add('c_adDetailsFieldLength', (blockName, textLength) => {
  cy.get(`textarea[name=${blockName}]`)
    .parents('.dc-input__wrapper')
    .find('.dc-input__footer .dc-input__counter')
    .should('contain.text', `${textLength}/300`)
})

Cypress.Commands.add('c_adDetailsFieldText', (blockName) => {
  cy.get(`textarea[name=${blockName}]`)
    .invoke('val')
    .then((text) => {
      let textLength = text.length
      cy.c_adDetailsFieldLength(blockName, textLength)
    })
  cy.get(`textarea[name=${blockName}]`).clear()
  cy.get(`textarea[name=${blockName}]`)
    .clear()
    .type('abc')
    .should('have.value', 'abc')
  cy.c_adDetailsFieldLength(blockName, 'abc'.length)
  let textLimitCheck = generateAccountNumberString(300)
  cy.get(`textarea[name=${blockName}]`)
    .clear()
    .type(textLimitCheck)
    .should('have.value', textLimitCheck)
  cy.c_adDetailsFieldLength(blockName, textLimitCheck.length)
  cy.get(`textarea[name=${blockName}]`)
    .clear()
    .type(textLimitCheck + '1')
    .should('have.value', textLimitCheck)
  cy.c_adDetailsFieldLength(blockName, textLimitCheck.length)
  let textForField = generateAccountNumberString(20)
  cy.get(`textarea[name=${blockName}]`)
    .clear()
    .type(textForField)
    .should('have.value', textForField)
  cy.c_adDetailsFieldLength(blockName, textForField.length)
})
