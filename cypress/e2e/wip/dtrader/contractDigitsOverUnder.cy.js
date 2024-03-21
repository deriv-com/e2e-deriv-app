import '@testing-library/cypress/add-commands'
import { stakeAmount } from '../../../support/dtrader'

describe('QATEST-5040 -  Verify contract for Digits', () => {
  beforeEach(() => {
    cy.c_login()
  })

  function createOverUnderContract(tradeType) {
    cy.get('span.number-selector__selection[data-value="5"]').click()
    cy.c_selectStakeTab()
    cy.findByLabelText('Amount').clear().type(stakeAmount)
    if (tradeType == 'Over') {
      cy.get('button.btn-purchase.btn-purchase--1').click()
    } else if (tradeType == 'Under') {
      cy.get('button.btn-purchase.btn-purchase--2').click()
    } else {
      cy.log('Please check trade type entered and locator')
    }
  }

  function checkContractDetailsPage() {
    cy.get('a.dc-result__caption-wrapper').click()
    cy.findByText('Contract details').should('be.visible')
    cy.contains('span[data-testid="dt_span"]', stakeAmount).should('be.visible') //verify stake amount
  }

  it('Should buy Even contract from Over/Under Trade Type', () => {
    cy.c_selectDemoAccount()
    cy.c_selectSymbol('Volatility 100 (1s) Index')
    cy.c_selectTradeType('Options', 'Over/Under')
    createOverUnderContract('Over')
    cy.get('a.dc-result__caption-wrapper', { timeout: 8000 }).should(
      'be.visible'
    )
    checkContractDetailsPage()
  })

  it('Should buy Odd contract from Over/Under Trade Type', () => {
    cy.c_selectDemoAccount()
    cy.c_selectSymbol('Volatility 100 (1s) Index')
    cy.c_selectTradeType('Options', 'Over/Under')
    createOverUnderContract('Under')
    cy.get('a.dc-result__caption-wrapper', { timeout: 8000 }).should(
      'be.visible'
    )
    checkContractDetailsPage()
  })
})
