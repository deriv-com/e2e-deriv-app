import '@testing-library/cypress/add-commands'

let fixedRate = 1.25
let minOrder = 6
let maxOrder = 10

describe('QATEST-145618 - Copy Ad - Fixed Rate - Buy Ad', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
    cy.c_login({ user: 'p2pFixedRate', rateLimitCheck: true })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('Should be able to copy an already existing buy type advert successfully.', () => {
    cy.c_navigateToP2P()
    cy.c_clickMyAdTab()
    cy.c_checkForExistingAds().then((adExists) => {
      if (adExists == false) {
        cy.c_createNewAd('buy')
        cy.c_inputAdDetails(fixedRate, minOrder, maxOrder, 'Buy', 'fixed', {
          paymentMethod: 'Alipay',
        })
      }
      cy.c_getExistingAdDetailsForValidation('Buy')
      cy.then(() => {
        cy.get('.wizard__main-step').prev().children().last().click()
        cy.contains('span[class="dc-text"]', 'Buy USD')
          .siblings('.dc-dropdown-container')
          .should('be.visible')
          .click()
        cy.findByText('Copy').parent().click()
        cy.c_copyExistingAd(
          sessionStorage.getItem('c_offerAmount'),
          sessionStorage.getItem('c_rateValue'),
          sessionStorage.getItem('c_instructions'),
          sessionStorage.getItem('c_orderCompletionTime'),
          null
        )
        cy.c_deleteCopiedAd()
      })
    })
  })
})
