import '@testing-library/cypress/add-commands'
import { stakeAmount } from '../../../support/dtrader'


describe('QATEST-5040 -  Verify contract for Digits', () => {
    beforeEach(() => {
      cy.c_login()
    })

    function createMatchDiffContract(tradeType){
      cy.get('span.number-selector__selection[data-value="5"]').click()
      cy.c_selectStakeTab()
      cy.findByLabelText('Amount').clear().type(stakeAmount)
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
      cy.contains('span[data-testid="dt_span"]', stakeAmount).should('be.visible')    //verify stake amount
    }

    it('Should buy Matches contract from Matches/Differs Trade Type', () => {
      cy.c_selectDemoAccount()
      cy.c_selectSymbol('Volatility 100 (1s) Index')
      cy.c_selectTradeType('Options','Matches/Differs')
      cy.c_validateDurationDigits('Matches/Differs')
      createMatchDiffContract('Matches')
      cy.get('a.dc-result__caption-wrapper', { timeout: 8000 }).should('be.visible');
      checkContractDetailsPage()  
            
    })

    it('Should buy Differs contract from Matches/Differs Trade Type', () => {
      cy.c_selectDemoAccount()
      cy.c_selectSymbol('Volatility 100 (1s) Index')
      cy.c_selectTradeType('Options','Matches/Differs')
      cy.c_validateDurationDigits('Matches/Differs')
      createMatchDiffContract('Differs')
      cy.get('a.dc-result__caption-wrapper', { timeout: 8000 }).should('be.visible');
      checkContractDetailsPage()

  })

})