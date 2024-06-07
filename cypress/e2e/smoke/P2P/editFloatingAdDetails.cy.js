import '@testing-library/cypress/add-commands'

let floatRate = 1.25
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
    cy.get('#1800').should('be.visible').click()
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
    cy.findByTestId('dt_dropdown_display').should('have.text', '30 minutes')
    cy.get('.wizard__main-step').prev().children().last().click()
    cy.findByText(`${(minOrder + 1).toFixed(2)} - ${maxOrder.toFixed(2)} USD`)
  })
})
