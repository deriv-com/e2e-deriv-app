import '@testing-library/cypress/add-commands'

let marketRate
let rate = 0.01
let ratecalculation
let calculatedValue
let roundedValue
let regexPattern
const decimalPlacesToSkip = 1

describe('QATEST-2414 - Create a Buy type Advert : Floating Rate', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('should be able to load my ads page', () => {

    // click on hamburger menu
    cy.get("#dt_mobile_drawer_toggle").should("be.visible")
    cy.get("#dt_mobile_drawer_toggle").click()
    // click on cashier 
    cy.get('.dc-mobile-drawer__body > :nth-child(4)').should("be.visible").click()
    // click on P2P 
    cy.findByText("Deriv P2P").should("be.visible").click()
    // confirm warning messageF
    cy.get('.dc-checkbox__box').should("be.visible").click()
    cy.findByRole("button", { name: "Confirm" }).click()
    // click on ads tab
    cy.get('.notification__close-button').should("be.visible").click()
    cy.findByText("My ads").should("be.visible").click()
    // create new ad (buy-floating rate)
    cy.findByRole("button", { name: "Create new ad" }).should("be.visible").click()
    // verify amount filed 
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
    // insert rate 
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
      if (match) {
        // Extracted value is available in match[1]
        marketRate = parseFloat(match[1])
        ratecalculation = rate * 0.01
        calculatedValue = ratecalculation * marketRate + marketRate
        regexPattern = new RegExp(`Your rate is = ${calculatedValue.toFixed(5 - decimalPlacesToSkip)}\\d{${decimalPlacesToSkip}} NZD`);
        cy.get('.floating-rate__hint').invoke('text').should('match', regexPattern)
        // Verify clicking plus button twice 
        cy.get('#floating_rate_input_add').click({ force: true }).click({ force: true })
        rate = rate + 0.02
        ratecalculation = rate * 0.01 
        calculatedValue = ratecalculation * marketRate + marketRate
        regexPattern = new RegExp(`Your rate is = ${calculatedValue.toFixed(6 - decimalPlacesToSkip)}\\d{${decimalPlacesToSkip}} NZD`);
        cy.get('.floating-rate__hint').invoke('text').should('match', regexPattern);
        // // verify minus button once  
        cy.get('#floating_rate_input_sub').click({ force: true })
        rate = rate - 0.01
        ratecalculation = rate * 0.01
        calculatedValue = ratecalculation * marketRate + marketRate
        regexPattern = new RegExp(`Your rate is = ${calculatedValue.toFixed(6 - decimalPlacesToSkip)}\\d{${decimalPlacesToSkip}} NZD`);
        console.log('regexPattern>>', regexPattern);
        cy.get('.floating-rate__hint').invoke('text').should('match', regexPattern);
      }
      else {
        throw new Error('Text does not match the expected pattern');
      }

    })
      // verify min filed
      cy.findByTestId('min_transaction').click().type('abc')
      cy.findByText("Only numbers are allowed.").should("be.visible")
      cy.findByTestId('min_transaction').click().clear().type('123abc')
      cy.findByText("Only numbers are allowed.").should("be.visible")
      cy.findByTestId('min_transaction').click().clear().type('!@#')
      cy.findByText("Only numbers are allowed.").should("be.visible")
      cy.findByTestId('min_transaction').click().clear().type('1234567890123456')
      cy.findByTestId('min_transaction').should('have.value', '123456789012345')
      cy.findByTestId('min_transaction').click().clear()
      cy.findByText("Min limit is required").should("be.visible")
      cy.findByTestId('min_transaction').click().type('11')
      cy.findByText("Amount should not be below Min limit").should("be.visible")
      cy.findByText("Min limit should not exceed Amount").should("be.visible")
      cy.findByTestId('min_transaction').click().clear().type('5')
      // verify max filed
      cy.findByTestId('max_transaction').click().type('abc')
      cy.findByText("Only numbers are allowed.").should("be.visible")
      cy.findByTestId('max_transaction').click().clear().type('123abc')
      cy.findByText("Only numbers are allowed.").should("be.visible")
      cy.findByTestId('max_transaction').click().clear().type('!@#')
      cy.findByText("Only numbers are allowed.").should("be.visible")
      cy.findByTestId('max_transaction').click().clear().type('1234567890123456')
      cy.findByTestId('max_transaction').should('have.value', '123456789012345')
      cy.findByTestId('max_transaction').click().clear()
      cy.findByText("Max limit is required").should("be.visible")
      cy.findByTestId('max_transaction').click().type('11')
      cy.findByText("Amount should not be below Max limit").should("be.visible")
      cy.findByText("Max limit should not exceed Amount").should("be.visible")
      cy.findByTestId('max_transaction').click().clear().type('10')
      // verify tooltip 
      cy.findByTestId('dt_order_time_selection_info_icon').click()
      cy.contains("Orders will expire if they aren’t completed within this time.")
      cy.findByRole("button", { name: "Ok" }).click()
      // verify completion order dropdown 
      cy.findByText("1 hour").should("be.visible")
      cy.findByTestId('dt_dropdown_display').click()
      cy.findByText("45 minutes").should("be.visible")
      cy.findByText("30 minutes").should("be.visible")
      cy.findByText("15 minutes").should("be.visible")
      cy.xpath('//*[@id=900]').click()
      // add payment method 
      cy.findByPlaceholderText('Add').click()
      cy.findByText('Other').click()
      cy.findByPlaceholderText('Add').click()
      cy.findByText('Bank Transfer').click()
      cy.findByPlaceholderText('Add').click()
      cy.findByText('Skrill').click()
      cy.findByPlaceholderText('Add').should('not.be.exist')
      // Post ad 
      cy.findByRole("button", { name: "Post ad" }).should("be.enabled").click()
      cy.findByText("You've created an ad").should("be.visible")
      cy.findByText("If the ad doesn't receive an order for 3 days, it will be deactivated.").should("be.visible")
      cy.findByText("Don’t show this message again.").should("be.visible")
      cy.findByRole("button", { name: "Ok" }).should("be.enabled").click() 
    
  })
})
