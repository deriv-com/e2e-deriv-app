describe('QATEST-2538 Empty State/Buy Sell Page', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
    cy.clearAllCookies()
    cy.c_login({ user: 'p2pVerifyEmptyStateAdScreen' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('Should be able to see an empty state of ads and verify message is displayed.', () => {
    cy.c_navigateToP2P()
    cy.c_checkForEmptyAdScreenMessage('Buy', 'Sell')
    cy.c_checkForEmptyAdScreenMessage('Sell', 'Buy')
    cy.findByTestId('dt_dropdown_container').should('be.visible').click()
    cy.findByText('Preferred currency').should('be.visible')
    cy.get('.dc-dropdown-list__item')
      .eq(1)
      .within(() => {
        cy.get('.currency-dropdown__list-item-symbol')
          .invoke('text')
          .then((currencyCode) => {
            const currency = currencyCode.trim()
            sessionStorage.setItem('c_currencyCode', currency)
            cy.findByText(sessionStorage.getItem('c_currencyCode'))
              .should('be.visible')
              .click()
          })
      })
    cy.then(() => {
      cy.findByTestId('dt_dropdown_container')
        .find('.dc-dropdown__display-text')
        .should('have.text', sessionStorage.getItem('c_currencyCode'))
      cy.c_checkForNonEmptyStateAdScreen()
    })
  })
})
