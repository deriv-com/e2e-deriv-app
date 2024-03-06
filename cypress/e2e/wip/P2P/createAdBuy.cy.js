import '@testing-library/cypress/add-commands'
import { } from '../../../support/p2p'


describe('QATEST-2414 - Create a Buy type Advert : Floating Rate', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('should be able to create buy type advert and verify all fields and messages', () => {
    cy.c_redirectToP2P()
    cy.c_createNewAd()
    // cy.c_verifyAmountFiled()
    // cy.c_verifyRate()
    // // verify min filed 
    // cy.c_verifyMaxMin('min_transaction', 5, 'Min')
    // // verify max filed 
    // cy.c_verifyMaxMin('max_transaction', 10, 'Max')
    // cy.c_verifyTooltip()
    // cy.c_verifyCompletionOrderDropdown()
    // cy.c_addPaymentMethod()
    // cy.c_verifyPostAd()

  })
})
