Cypress.Commands.add(
  'c_inputAdDetails',
  (rateValue, minOrder, maxOrder, adType, rateType, options = {}) => {
    const { paymentMethod = pm1 } = options
    cy.findByText(`${adType} USD`).click()
    cy.findByTestId('offer_amount')
      .next('span.dc-text')
      .invoke('text')
      .then((fiatCurrency) => {
        sessionStorage.setItem('c_fiatCurrency', fiatCurrency.trim())
      })
    if (rateType == 'fixed') {
      cy.findByTestId('fixed_rate_type')
        .next('span.dc-text')
        .invoke('text')
        .then((localCurrency) => {
          sessionStorage.setItem('c_localCurrency', localCurrency.trim())
        })
    } else if (rateType == 'float') {
      cy.get('.floating-rate__hint')
        .invoke('text')
        .then((localCurrency) => {
          sessionStorage.setItem('c_localCurrency', localCurrency.trim())
        })
    }
    cy.then(() => {
      cy.findByTestId('offer_amount').type('10').should('have.value', '10')
      if (rateType == 'fixed') {
        cy.findByTestId('fixed_rate_type')
          .type(rateValue)
          .should('have.value', rateValue)
      } else if (rateType == 'float') {
        if (adType == 'buy') {
          cy.findByTestId('float_rate_type').should(
            'have.value',
            '-'.concat(rateValue)
          )
        } else if (adType == 'sell') {
          cy.findByTestId('float_rate_type').should(
            'have.value',
            '+'.concat(rateValue)
          )
        }
      }
      cy.findByTestId('min_transaction')
        .type(minOrder)
        .should('have.value', minOrder)
      cy.findByTestId('max_transaction')
        .type(maxOrder)
        .should('have.value', maxOrder)
      if (adType == 'Sell') {
        cy.findByTestId('contact_info')
          .type('Contact Info Block')
          .should('have.value', 'Contact Info Block')
      }
      cy.findByTestId('default_advert_description')
        .type('Description Block')
        .should('have.value', 'Description Block')
      cy.findByRole('button', { name: 'Next' }).should('be.enabled').click()
      cy.findByText('Set payment details').should('be.visible')
      cy.findByTestId('dt_dropdown_display').click()
      cy.get('#900').should('be.visible').click()
      if (adType == 'Sell') {
        cy.findByTestId('dt_payment_method_card_add_icon')
          .should('be.visible')
          .click()
        cy.c_addPaymentMethod(paymentIDForCopyAdSell, paymentMethod)
        cy.findByText(paymentIDForCopyAdSell)
          .should('exist')
          .parent()
          .prev()
          .find('.dc-checkbox')
          .and('exist')
          .click()
        cy.findByRole('button', { name: 'Next' }).should('be.enabled').click()
        cy.findByText('Set ad conditions').should('be.visible')
      } else if (adType == 'Buy') {
        cy.c_PaymentMethod()
      }
      cy.c_verifyPostAd()
      cy.c_verifyAdOnMyAdsScreen(
        adType,
        sessionStorage.getItem('c_fiatCurrency'),
        sessionStorage.getItem('c_localCurrency'),
        rateValue,
        minOrder,
        maxOrder,
        rateType
      )
    })
  }
)

Cypress.Commands.add(
  'c_verifyAdOnMyAdsScreen',
  (
    adType,
    fiatCurrency,
    localCurrency,
    rateValue,
    minOrder,
    maxOrder,
    rateType
  ) => {
    cy.findByText('Active').should('be.visible')
    cy.findByText(`${adType} ${fiatCurrency}`).should('be.visible')
    if (rateType === 'float') {
      const ratePrefix = adType === 'Buy' ? '-' : '+'
      cy.findByText(`${ratePrefix}${rateValue}%`).should('be.visible')
    } else if (rateType === 'fixed') {
      cy.findByText(`${rateValue} ${localCurrency}`).should('be.visible')
    }
    cy.findByText(
      `${minOrder.toFixed(2)} - ${maxOrder.toFixed(2)} ${fiatCurrency}`
    ).should('be.visible')
  }
)
