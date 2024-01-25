import '@testing-library/cypress/add-commands'

describe('Place order Matches and Differes order from Digits trade category', () => {
    beforeEach(() => {
      cy.c_login()
    })

    function selectSymbol(symbolName){
      cy.get('.cq-symbol-select-btn').click()
      cy.get('.ic-icon.sc-mcd__filter__group-icon.sc-mcd__filter__group-icon--open').should('be.visible')
      cy.findByText('Synthetics').should('be.visible').click()
      cy.contains('div.sc-mcd__item__name', symbolName).click()
    }

    function selectTradeType(category,tradeType){
      cy.findByTestId('dt_contract_dropdown').click()
      cy.findByText(category).click()
      cy.findByText(tradeType).should('be.visible').click()
    }

    function createMatchDiffContract(tradeType){
      //cy.get('span.range-slider__ticks-step').eq(4).click()
      cy.get('span.number-selector__selection[data-value="5"]').click()
      cy.findByRole('button', { name: 'Stake' }).click()
      cy.findByLabelText('Amount').clear().type('10')
      if(tradeType == 'Matches'){
        cy.get('button.btn-purchase.btn-purchase--1').click()
      }else if(tradeType == 'Differs'){
        cy.get('button.btn-purchase.btn-purchase--2').click()
      }else{
        cy.log("Please check trade type entered and locator")
      }
    }

    function checkContractDetailsPage(){
      cy.get('a.dc-result__caption-wrapper').click()
      cy.findByText('Contract details').should('be.visible')  
      cy.contains('span[data-testid="dt_span"]', '10.00').should('be.visible')    //verify stake amount
    }

    it('Should buy Matches contract from Matches/Differs Trade Type', () => {
      cy.c_selectDemoAccount()
      selectSymbol('Volatility 100 (1s) Index')
      selectTradeType('Options','Matches/Differs')
      createMatchDiffContract('Matches')
      cy.get('a.dc-result__caption-wrapper', { timeout: 8000 }).should('be.visible');
      checkContractDetailsPage()  
            
    })

    it('Should buy Differs contract from Matches/Differs Trade Type', () => {
      cy.c_selectDemoAccount()
      selectSymbol('Volatility 100 (1s) Index')
      selectTradeType('Options','Matches/Differs')
      createMatchDiffContract('Differs')
      cy.get('a.dc-result__caption-wrapper', { timeout: 8000 }).should('be.visible');
      checkContractDetailsPage()

  })

})