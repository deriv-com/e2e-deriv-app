import '@testing-library/cypress/add-commands'

let fixedRate = 1.25
let minOrder = 5
let maxOrder = 10

function verifyAdOnMyAdsScreen(fiatCurrency, localCurrency) {
  cy.findByText('Active').should('be.visible')
  cy.findByText(`Buy ${fiatCurrency}`).should('be.visible')
  cy.findByText(`${fixedRate} ${localCurrency}`)
  cy.findByText(
    `${minOrder.toFixed(2)} - ${maxOrder.toFixed(2)} ${fiatCurrency}`
  )
}

describe('QATEST-2403 - Create a Buy type Advert - Fixed Rate', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
    cy.c_login({ user: 'p2pFixedRate' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('Should be able to create buy type advert and verify all fields and messages for fixed rate.', () => {
    cy.c_navigateToP2P()
    cy.c_clickMyAdTab()
    cy.c_createNewAd('buy')
    cy.findByText('Buy USD').click()
    cy.findByTestId('offer_amount')
      .next('span.dc-text')
      .invoke('text')
      .then((fiatCurrency) => {
        sessionStorage.setItem('c_fiatCurrency', fiatCurrency.trim())
      })
    cy.findByTestId('fixed_rate_type')
      .next('span.dc-text')
      .invoke('text')
      .then((localCurrency) => {
        sessionStorage.setItem('c_localCurrency', localCurrency.trim())
      })
    cy.then(() => {
      cy.c_verifyAmountFiled()
      cy.c_verifyFixedRate(fixedRate)
      cy.c_verifyMaxMin('min_transaction', minOrder, 'Min')
      cy.c_verifyMaxMin('max_transaction', maxOrder, 'Max')
      cy.c_verifyTextAreaBlock('default_advert_description')
      cy.c_verifyTooltip()
      cy.c_verifyCompletionOrderDropdown()
      cy.c_verifyAdSummary(
        'buy',
        10,
        fixedRate,
        sessionStorage.getItem('c_fiatCurrency'),
        sessionStorage.getItem('c_localCurrency')
      )
      cy.c_PaymentMethod()
      cy.c_verifyPostAd()
      verifyAdOnMyAdsScreen(
        sessionStorage.getItem('c_fiatCurrency'),
        sessionStorage.getItem('c_localCurrency')
      )
    })
  })
})
