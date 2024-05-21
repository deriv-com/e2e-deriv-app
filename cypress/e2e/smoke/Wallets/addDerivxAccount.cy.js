import '@testing-library/cypress/add-commands'

describe('QATEST-98821 - Add demo derivx account and QATEST-98824 add real derivx account', () => {
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
  })

  it('should be able to add DerivX USD account', () => {
    cy.log('add derivx account')
    cy.c_visitResponsive('/wallets', 'large')
    const Text = Cypress.$(
      ":contains('This account offers CFDs on a highly customisable CFD trading platform.')"
    )
    if (Text.length > 0) {
      cy.addDerivxAccount('Real')
      cy.addDerivxAccount('Demo')
    }
  })

  it('should be able to add DerivX USD account', () => {
    cy.log('add derivx account')
    cy.c_visitResponsive('/wallets', 'large')
    const Text = Cypress.$(
      ":contains('This account offers CFDs on a highly customisable CFD trading platform.')"
    )
    if (Text.length > 0) {
      cy.addDerivxAccount('Real')
    }
  })

  it('should be able to add Demo DerivX USD account in responsive', () => {
    cy.log('add derivx account')
    cy.c_visitResponsive('/wallets', 'small')
    cy.c_switchWalletsAccountDemo()
    const Text = Cypress.$(
      ":contains('This account offers CFDs on a highly customisable CFD trading platform.')"
    )
    if (Text.length > 0) {
      cy.addDerivxAccount('Real')
    }
  })
})
