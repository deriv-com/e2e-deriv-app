import '@testing-library/cypress/add-commands'

describe('QATEST-142456 - Add Trading account', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletloginEmail' })
  })

  it('should be able to add DerivX USD account', () => {
    cy.log('add derivx account')
    cy.c_visitResponsive('/', 'large')
    const Text = Cypress.$(
      ":contains('This account offers CFDs on a highly customisable CFD trading platform.')"
    )
    if (Text.length > 0) {
      clickAddDerivxButton()
      verifyDerivxCreation('Real')
      verifyTransferFundsMessage('Real')
      expandDemoWallet()
      clickAddDerivxButton()
      verifyDerivxCreation('Demo')
      verifyTransferFundsMessage('Demo')
    }
  })
})
