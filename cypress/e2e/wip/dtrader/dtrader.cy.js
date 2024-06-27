describe('QATEST-5014, QATEST-5055 - Verify Main Page and Multipliers', () => {
  beforeEach(() => {
    cy.c_login()
  })

  it('should be able to switch between accounts', () => {
    //Account switcher
    cy.findByTestId('dt_acc_info').click()
    cy.get('#dt_core_account-switcher_demo-tab').click()
    cy.findByTestId('acc-switcher').findByText('Real').click()
    cy.get('#dt_core_account-switcher_demo-tab').click()

    //Markets
    cy.get('.cq-symbol-select-btn').click()
    cy.findByText('Baskets', { exact: true }).click()
    cy.findByText('Commodities Basket', { exact: true }).should('be.visible')
    cy.findByText('Forex Basket', { exact: true }).should('be.visible')
    cy.get(
      '.sc-mcd__category__content--commodities-basket > .subcategory > a > .ic-icon'
    ).should('be.visible') //Cypress multiple tabs support issue

    //Trade Types
    cy.findByTestId('dt_contract_dropdown').click()
    cy.findByText('Options').click()
    cy.findByTestId('dt_contract_wrapper').findByText('Multipliers').click()
    cy.findByTestId('dt_contract_wrapper')
      .findByPlaceholderText('Search')
      .click({ force: true })
    cy.findByTestId('dt_contract_wrapper')
      .findByPlaceholderText('Search')
      .type('mul')
    cy.findByTestId('dt_contract_item')
      .findByText('Multipliers')
      .should('be.visible')
    cy.get('#info-icon').click({ force: true })
  })

  it('should be able to verify contract for Multipliers', () => {
    cy.findByTestId('dt_acc_info').click()
    cy.get('#dt_core_account-switcher_demo-tab').click()
    cy.get('.acc-switcher__id > :nth-child(2)')
    cy.findByTestId('dt_contract_dropdown').click({ force: true })
    cy.get('#dt_contract_multiplier_item').click({ force: true })
    cy.findByRole('button', { name: 'Up 10.00 USD' }).should('exist')
    cy.findByRole('button', { name: 'Down 10.00 USD' }).should('exist')
    cy.findByLabelText('Increment value').click()
    cy.findByRole('button', { name: 'Up 11.00 USD' }).should('exist')
    cy.findByRole('button', { name: 'Down 11.00 USD' }).should('exist')
    cy.findByLabelText('Decrement value').click()
    cy.findByLabelText('Decrement value').click()
    cy.findByRole('button', { name: 'Up 9.00 USD' }).should('exist')
    cy.findByRole('button', { name: 'Down 9.00 USD' }).should('exist')
  })

  it('To check ticks are coming for different markets ', () => {
    cy.c_selectDemoAccount()

    cy.c_selectSymbol('Gold Basket')
    cy.c_checkSymbolTickChange(5000)

    cy.c_selectSymbol('Volatility 10 (1s) Index')
    cy.c_checkSymbolTickChange(3000)

    cy.c_selectSymbol('AUD/JPY')
    cy.c_checkSymbolTickChange(5000)

    cy.c_selectSymbol('Gold/USD') //Bloomberg, oz, idataprovider provider
    cy.c_checkSymbolTickChange(5000)
  })

  function matchStakePayoutValue(tradeType, tradeTypeParentLocator) {
    let stakeValueUp
    let payoutValueUp

    cy.c_selectTradeType('Options', tradeType)
    cy.findByRole('button', { name: 'Stake' }).click()
    cy.get(tradeTypeParentLocator).contains(
      '.trade-container__price-info-basis',
      'Payout'
    )

    cy.get(tradeTypeParentLocator)
      .find(
        '.trade-container__price-info-value span.trade-container__price-info-currency'
      )
      .invoke('text')
      .then((textValue) => {
        stakeValueUp = textValue.trim().split(' ')[0]
        cy.findByRole('button', { name: 'Payout' }).click()
        cy.get(tradeTypeParentLocator).contains(
          '.trade-container__price-info-basis',
          'Stake'
        )

        cy.get(tradeTypeParentLocator)
          .find(
            '.trade-container__price-info-value span.trade-container__price-info-currency'
          )
          .invoke('text')
          .then((textValue) => {
            payoutValueUp = textValue.trim().split(' ')[0]
            expect(stakeValueUp).to.not.equal(payoutValueUp)
          })
      })
  }

  it('To check on switching Stake and Payout tab', () => {
    cy.c_selectDemoAccount()
    cy.c_selectSymbol('Volatility 100 (1s) Index')

    matchStakePayoutValue('Rise/Fall', '#dt_purchase_call_price')
    matchStakePayoutValue('Matches/Differs', '#dt_purchase_digitmatch_price')
    matchStakePayoutValue('Higher/Lower', '#dt_purchase_call_price')
  })
})
