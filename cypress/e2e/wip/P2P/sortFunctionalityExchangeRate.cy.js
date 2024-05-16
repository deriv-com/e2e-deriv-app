import '@testing-library/cypress/add-commands'

describe('QATEST-2718 Sort Functionality (by Exchange Rate)', () => {
  beforeEach(() => {
    cy.c_login({ user: 'p2pSortFunctionality' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('Should be able to sort by Exchange Rate.', () => {
    cy.c_navigateToDerivP2P()
    cy.c_closeSafetyInstructions()
    cy.findByText('Deriv P2P').should('exist')
    cy.c_closeNotificationHeader()
    cy.c_sortOrdersBy('User rating')
  })
})
