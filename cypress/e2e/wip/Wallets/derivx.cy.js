import '@testing-library/cypress/add-commands'

function clickAddDerivxButton() {
  cy.get('.wallets-available-dxtrade__icon')
    .parent('.wallets-trading-account-card')
    .click()
}

function verifyDerivxCreation(accountType) {
  let expectedText
  if (accountType === 'Real') {
    expectedText = 'Create a Deriv X password'
    cy.get('div').contains(expectedText).should('be.visible')
    cy.findByPlaceholderText('Deriv X password')
      .click()
      .type(Cypress.env('mt5Password'))
    cy.findByRole('button', { name: 'Create Deriv X password' }).click()
  } else {
    expectedText = 'Enter your Deriv X password' // Adjust this text based on your actual requirement
    cy.get('div').contains(expectedText).should('be.visible')
    cy.findByPlaceholderText('Deriv X password')
      .click()
      .type(Cypress.env('mt5Password'))
    cy.findByRole('button', { name: 'Add account' }).click()
  }
}

function verifyTransferFundsMessage(accountType) {
  if (accountType === 'Real') {
    cy.findByText('Your Deriv X account is ready').should('be.visible')
    cy.findByRole('button', { name: 'Maybe later' }).should('exist')
    cy.findByRole('button', { name: 'Transfer funds' }).should('exist')
    cy.findByRole('button', { name: 'Maybe later' }).click()
  } else {
    cy.contains('div', "Your Deriv X demo account is readyLet's").should(
      'be.visible'
    )
    cy.findByRole('button', { name: 'OK' }).click()
  }
}

function expandDemoWallet() {
  cy.get('.wallets-dropdown__button').click()
  cy.get('.wallets-list-card-dropdown__item-content')
    .contains('USD Demo Wallet')
    .click()
  cy.contains('USD Demo Wallet').should('be.visible')
}

describe('WALL-3252 - Add derivx account', () => {
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
      clickAddDerivxButton()
      verifyDerivxCreation('Real')
      verifyTransferFundsMessage('Real')
      expandDemoWallet()
      clickAddDerivxButton()
      verifyDerivxCreation('Demo')
      verifyTransferFundsMessage('Demo')
    }
  })
  it('should be able to add DerivX USD account in responsive', () => {
    cy.log('add derivx account')
    cy.c_visitResponsive('/wallets', 'small')
    const Text = Cypress.$(
      ":contains('This account offers CFDs on a highly customisable CFD trading platform.')"
    )
    if (Text.length > 0) {
      clickAddDerivxButton()
      verifyDerivxCreation('Real')
      verifyTransferFundsMessage('Real')
    }
  })
})
