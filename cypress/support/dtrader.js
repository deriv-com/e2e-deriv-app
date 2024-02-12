
export const stakeAmount = '10.00'
export const tickDuration = 4

Cypress.Commands.add("c_selectSymbol", (symbolName) => {
    cy.get('.cq-symbol-select-btn', { timeout: 20000 }).should('be.visible')
    cy.get('.cq-symbol-select-btn').click()
    cy.get('.ic-icon.sc-mcd__filter__group-icon.sc-mcd__filter__group-icon--open').should('be.visible')
    cy.findByText('Synthetics').should('be.visible').click()
    cy.contains('div.sc-mcd__item__name', symbolName).click()
  })
  
  
  Cypress.Commands.add("c_selectTradeType", (category,tradeType) => {
    cy.findByTestId('dt_contract_dropdown').click()
    cy.findByText(category).click()
    cy.findByText(tradeType).should('be.visible').click()
  })


  Cypress.Commands.add("c_checkSymbolTickChange" , (duration)=> {
    let initialText;
    cy.get('div.cq-animated-price.cq-current-price.cq-down').invoke('text').then((text) => {
      initialText = text
    })
    cy.wait(duration);
    cy.get('div.cq-animated-price.cq-current-price.cq-down').invoke('text').then((text) => {
      expect(text).to.not.eq(initialText)
    })
  })

  Cypress.Commands.add("c_selectStakeTab" , ()=> {
    cy.findByRole('button', { name: 'Stake' }).click()  
  })

  Cypress.Commands.add("c_selectPayoutTab" , ()=> {
    cy.findByRole('button', { name: 'Payout' }).click()  
  })

  Cypress.Commands.add("c_selectTickDuration" , ()=> {
    cy.get(`[data-testid="tick_step_${tickDuration}"]`).click({ force: true }) // adding force true due to scss in locator
  })

  Cypress.Commands.add("c_validateDurationDigits", (tradetype) => {
   if(tradetype == 'Matches/Differs' || 'Even/Odd' || 'Over/Under'){
    cy.contains('span.dc-text.dc-dropdown__display-text', 'Ticks').should('be.visible')
    cy.findByRole('button', { name: 'Ticks' }).should('not.exist')
    cy.findByRole('button', { name: 'Minutes' }).should('not.exist')
    cy.findByRole('button', { name: 'End time' }).should('not.exist')
    cy.findByRole('button', { name: 'Duration' }).should('not.exist')
   }
  })
  

  Cypress.Commands.add("c_matchStakePayoutValue" , (tradeType, tradeTypeParentLocator)=> {
    let stakeValueUp
    let payoutValueUp
    cy.c_selectTradeType('Options',tradeType)
    cy.c_selectStakeTab()
    cy.get(tradeTypeParentLocator).contains('.trade-container__price-info-basis', 'Payout')
    
    cy.get(tradeTypeParentLocator)
    .find('.trade-container__price-info-value span.trade-container__price-info-currency')
    .invoke('text')
    .then((textValue) => {
      stakeValueUp = textValue.trim().split(' ')[0]
      cy.c_selectPayoutTab()
      cy.get(tradeTypeParentLocator).contains('.trade-container__price-info-basis', 'Stake')
  
      cy.get(tradeTypeParentLocator)
      .find('.trade-container__price-info-value span.trade-container__price-info-currency')
      .invoke('text')
      .then((textValue) => {
        payoutValueUp = textValue.trim().split(' ')[0]
        expect(stakeValueUp).to.not.equal(payoutValueUp)
      })
    })
  })

