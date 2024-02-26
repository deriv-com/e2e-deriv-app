import '@testing-library/cypress/add-commands'
import { } from '../../../support/p2p'


describe('QATEST-2414 - Create a Buy type Advert : Floating Rate', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('should be able to create buy type advert and verify all fields and messages', () => {
    cy.redirectToP2P()
    cy.createNewAd()
    cy.verifyAmountFiled()
    cy.verifyRate()
    // verify min filed 
    cy.verifyMaxMin('min_transaction', 5, 'Min')
    // verify max filed 
    cy.verifyMaxMin('max_transaction', 10, 'Max')
    cy.verifyTooltip()
    cy.verifyCompletionOrderDropdown()
    cy.addPaymentMethod()
    cy.verifyPostAd()

  })
})
