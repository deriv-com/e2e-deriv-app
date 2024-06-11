describe('QATEST-2414 - Create a Buy type Advert : Floating Rate', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.c_login({ user: 'p2pFloating' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('should be able to create buy type advert and verify all fields and messages', () => {
    cy.c_navigateToP2P()
    cy.c_clickMyAdTab()
    cy.c_createNewAd('buy')
    cy.c_verifyAmountFiled()
    cy.c_verifyRate()
    cy.c_verifyMaxMin('min_transaction', 5, 'Min')
    cy.c_verifyMaxMin('max_transaction', 10, 'Max')
    cy.c_verifyTooltip()
    cy.c_verifyCompletionOrderDropdown()
    cy.c_PaymentMethod()
    cy.c_verifyPostAd()
    cy.c_verifyBuyAds()
  })
})
