import '@testing-library/cypress/add-commands'
import { stakeAmount } from '../../../support/dtrader'

describe('QATEST-5040 -  Verify contract for Digits', () => {
    beforeEach(() => {
      cy.c_login()
    })

    function createEvenOddContract(tradeType){
      cy.c_selectStakeTab()
      cy.findByLabelText('Amount').clear().type(stakeAmount.toString())
      if(tradeType == 'Even'){
        cy.get('button.btn-purchase.btn-purchase--1').click()
      }else if(tradeType == 'Odd'){
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

    it('Should buy Even contract from Even/Odd Trade Type', () => {
      cy.c_selectDemoAccount()
      cy.c_selectSymbol('Volatility 100 (1s) Index')
      cy.c_selectTradeType('Options','Even/Odd')
      createEvenOddContract('Even')
      cy.get('a.dc-result__caption-wrapper', { timeout: 8000 }).should('be.visible');
      checkContractDetailsPage()  
            
    })

    it('Should buy Odd contract from Even/Odd Trade Type', () => {
      cy.c_selectDemoAccount()
      cy.c_selectSymbol('Volatility 100 (1s) Index')
      cy.c_selectTradeType('Options','Even/Odd')
      createEvenOddContract('Odd')
      cy.get('a.dc-result__caption-wrapper', { timeout: 8000 }).should('be.visible');
      checkContractDetailsPage()

  })

})