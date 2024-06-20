let floatRate = 0.01
let minOrder = 5
let maxOrder = 10

describe('QATEST-2488 - Edit Advert Details - Float Rate', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
    cy.c_login({ user: 'p2pFloating' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })
  it('Should be able to edit buy type advert and verify all fields and messages for floating rate.', () => {
    cy.c_navigateToP2P()
    cy.c_clickMyAdTab()
    cy.c_createNewAd('buy')
    cy.c_inputAdDetails(floatRate, minOrder, maxOrder, 'Buy', 'float')
    cy.c_editAdAndVerify('buy', minOrder, maxOrder)
  })
  it('Should be able to edit sell type advert and verify all fields and messages for floating rate.', () => {
    cy.c_navigateToP2P()
    cy.c_clickMyAdTab()
    cy.c_createNewAd('sell')
    cy.c_inputAdDetails(floatRate, minOrder, maxOrder, 'Sell', 'float', {
      paymentMethod: 'Skrill',
    })
    cy.c_editAdAndVerify('sell', minOrder, maxOrder)
  })
})
