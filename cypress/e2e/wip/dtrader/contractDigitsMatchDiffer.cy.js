import '@testing-library/cypress/add-commands'
import * as dtraderVariable from '../../../support/dtrader'


describe('QATEST-5040 -  Verify contract for Digits', () => {
    beforeEach(() => {
      cy.c_login()
    })

    function createMatchDiffContract(tradeType){
      cy.get('span.number-selector__selection[data-value="5"]').click()
      cy.c_selectStakeTab()
      cy.findByLabelText('Amount').clear().type(dtraderVariable.stakeAmount)
      if(tradeType == 'Matches'){
        cy.get('button.btn-purchase.btn-purchase--1').click()
      }else if(tradeType == 'Differs'){
        cy.get('button.btn-purchase.btn-purchase--2').click()
      }else{
        cy.log("Please check trade type entered and locator")
      }
    }

    it('Should buy Matches contract from Matches Trade Type', () => {
      cy.c_selectDemoAccount()
      cy.c_selectSymbol('Volatility 100 (1s) Index')
      cy.c_selectTradeType('Options','Matches/Differs')
      cy.c_validateDurationDigits('Matches/Differs')
      cy.c_selectTickDuration()
      cy.c_matchStakePayoutValue('Matches/Differs', '#dt_purchase_digitmatch_price' )
      createMatchDiffContract('Matches')
      cy.get('a.dc-result__caption-wrapper', { timeout: (dtraderVariable.tickDuration *1000)+3000 }).should('be.visible')
      cy.c_checkContractDetailsPage('Matches/Differs',dtraderVariable.stakeAmount,dtraderVariable.tickDuration )
            
    })

    it('Should buy Differs contract from Differs Trade Type', () => {
      cy.c_selectDemoAccount()
      cy.c_selectSymbol('Volatility 100 (1s) Index')
      cy.c_selectTradeType('Options','Matches/Differs')
      cy.c_validateDurationDigits('Matches/Differs')
      cy.c_selectTickDuration()
      cy.c_matchStakePayoutValue('Matches/Differs', '#dt_purchase_digitmatch_price' )
      createMatchDiffContract('Differs')
      cy.get('a.dc-result__caption-wrapper', { timeout: (dtraderVariable.tickDuration *1000)+3000 }).should('be.visible')
      cy.c_checkContractDetailsPage('Matches/Differs',dtraderVariable.stakeAmount,dtraderVariable.tickDuration )

  })

})