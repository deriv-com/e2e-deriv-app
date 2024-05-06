import '@testing-library/cypress/add-commands'

// function verifyBuyAds(minLimit, maxLimit, pm1, pm2, pm3) {
//   cy.findByText('Active').should('be.visible')
//   cy.findByText('Buy USD').should('be.visible')
//   cy.findByText(minLimit + '.00 - ' + maxLimit + '.00 USD')
//   cy.contains(pm1)
//   cy.contains(pm2)
//   cy.contains(pm3)
//   cy.get('@expectedRate').then((rate) => {
//     cy.get('element-selector').should('have.value', rate)
//   // cy.contains(rate)
//   })
// }

describe('QATEST-2414 - Create a Buy type Advert : Floating Rate', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.c_login({ user: 'p2pFloating' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('should be able to create buy type advert and verify all fields and messages', () => {
    cy.c_navigateToDerivP2P()
    cy.c_closeSafetyInstructions()
    cy.c_closeNotificationHeader()
    cy.c_clickMyAdTab()
    cy.c_createNewAd('buy')
    cy.c_verifyAmountFiled()
    cy.c_verifyRate()
    cy.c_verifyMaxMin('min_transaction', minLimit, 'Min')
    cy.c_verifyMaxMin('max_transaction', maxLimit, 'Max')
    cy.c_verifyTooltip()
    cy.c_verifyCompletionOrderDropdown()
    cy.c_PaymentMethod()
    // cy.c_PaymentMethod(pm1, pm2, pm3)
    cy.c_verifyPostAd()
    // verifyBuyAds()
    cy.c_verifyBuyAds()
    // verifyBuyAds(minLimit, maxLimit, pm1, pm2, pm3)
  })
})
