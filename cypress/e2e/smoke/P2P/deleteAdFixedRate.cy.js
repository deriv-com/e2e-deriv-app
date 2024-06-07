import '@testing-library/cypress/add-commands'

let fixedRate = 1.25
let minOrder = 5
let maxOrder = 10

describe('QATEST-2482 - Delete Advert - Fixed Rate', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
    cy.c_login({ user: 'p2pFixedRate' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('Should be able to delete newly created advert for fixed rate.', () => {
    cy.c_navigateToP2P()
    cy.c_clickMyAdTab()
    cy.c_checkForExistingAds().then((adExists) => {
      if (adExists == false) {
        cy.c_createNewAd('buy')
        cy.c_inputAdDetails(fixedRate, minOrder, maxOrder, 'Buy', 'fixed')
      }
      cy.c_removeExistingAds()
    })
  })
})
