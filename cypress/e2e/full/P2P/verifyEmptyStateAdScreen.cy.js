import '@testing-library/cypress/add-commands'

let currency = {
  name: 'Indonesian Rupiah',
  code: 'IDR',
}

describe('QATEST-2538 Empty State/Buy Sell Page', () => {
  beforeEach(() => {
    cy.c_login({ user: 'p2pVerifyEmptyStateAdScreen' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('Should be able to see an empty state of ads and verify message is displayed.', () => {
    cy.c_navigateToDerivP2P()
    cy.c_skipPasskey()
    cy.findByText('Deriv P2P').should('exist')
    cy.c_closeNotificationHeader()
    cy.c_checkForEmptyAdScreenMessage('Buy', 'Sell')
    cy.c_checkForEmptyAdScreenMessage('Sell', 'Buy')
    cy.findByTestId('dt_dropdown_container').should('be.visible').click()
    cy.findByText('Preferred currency').should('be.visible')
    cy.findByText(currency.name).should('be.visible').click()
    cy.findByTestId('dt_dropdown_container')
      .find('.dc-dropdown__display-text')
      .should('have.text', currency.code)
    cy.c_checkForNonEmptyStateAdScreen()
  })
})
