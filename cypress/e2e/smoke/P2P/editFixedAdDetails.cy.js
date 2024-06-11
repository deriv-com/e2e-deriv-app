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

describe('QATEST-2469 - Edit Advert Details - Fixed Rate', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
    cy.c_login({ user: 'p2pFixedRate' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('Should be able to edit buy type advert and verify all fields and messages for fixed rate.', () => {
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
      cy.findByTestId('offer_amount').type('10').should('have.value', '10')
      cy.findByTestId('fixed_rate_type')
        .type(fixedRate)
        .should('have.value', fixedRate)
      cy.findByTestId('min_transaction')
        .type(minOrder)
        .should('have.value', minOrder)
      cy.findByTestId('max_transaction')
        .type(maxOrder)
        .should('have.value', maxOrder)
      cy.findByTestId('default_advert_description')
        .type('Description Block')
        .should('have.value', 'Description Block')
      cy.findByRole('button', { name: 'Next' }).should('be.enabled').click()
      cy.findByText('Set payment details').should('be.visible')
      cy.findByTestId('dt_dropdown_display').click()
      cy.get('#900').should('be.visible').click()
      cy.c_PaymentMethod()
      cy.c_verifyPostAd()
      verifyAdOnMyAdsScreen(
        sessionStorage.getItem('c_fiatCurrency'),
        sessionStorage.getItem('c_localCurrency')
      )
      cy.get('.my-ads-table__row .dc-dropdown-container')
        .should('be.visible')
        .click()
      cy.findByText('Edit').parent().click()
      cy.findByTestId('offer_amount').should('be.disabled')
      cy.findByTestId('min_transaction')
        .clear()
        .type(minOrder + 1)
      cy.findByTestId('max_transaction').clear().type(maxOrder)
      cy.findByRole('button', { name: 'Next' }).should('be.enabled').click()
      cy.findByText('Edit payment details').should('be.visible')
      cy.findByTestId('dt_dropdown_display').click()
      cy.get('#2700').should('be.visible').click()
      cy.findByRole('button', { name: 'Next' }).should('be.enabled').click()
      cy.findByText('Edit ad conditions').should('be.visible')
      cy.findByRole('button', { name: 'Save changes' })
        .should('be.enabled')
        .click()
      cy.get('.my-ads-table__row .dc-dropdown-container')
        .should('be.visible')
        .click()
      cy.findByText('Edit').parent().click()
      cy.findByRole('button', { name: 'Next' }).should('be.enabled').click()
      cy.findByText('Edit payment details').should('be.visible')
      cy.findByTestId('dt_dropdown_display').should('have.text', '45 minutes')
      cy.get('.wizard__main-step').prev().children().last().click()
      cy.findByText(`${(minOrder + 1).toFixed(2)} - ${maxOrder.toFixed(2)} USD`)
    })
  })
})
