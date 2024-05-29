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
    cy.findByText('Your Deriv X demo account is ready').should('be.visible')
    cy.findByRole('button', { name: 'OK' }).click()
  }
}

function expandDemoWallet() {
  cy.get('label').find('span').click()
  cy.findByText('USD Demo Wallet').should('be.visible')
}

describe('QATEST-98821 - Add demo derivx account and QATEST-98824 add real derivx account', () => {
  it('should be able to add DerivX USD account', () => {
    cy.log('add derivx account')
    cy.c_login({ user: 'walletloginEmail' })
    cy.c_visitResponsive('/', 'large')
    cy.findByText(
      'CFDs on financial and derived instruments via a customisable platform.'
    )
      .should('exist')
      .then(() => {
        clickAddDerivxButton()
        verifyDerivxCreation('Real')
        verifyTransferFundsMessage('Real')
        expandDemoWallet()
        clickAddDerivxButton()
        verifyDerivxCreation('Demo')
        verifyTransferFundsMessage('Demo')
      })
  })
  it.only('should be able to add DerivX USD account in responsive', () => {
    cy.log('add derivx account')
    cy.c_login({ user: 'walletloginEmailMobile' })
    cy.c_visitResponsive('/', 'small')
    cy.findByText(
      'CFDs on financial and derived instruments via a customisable platform.'
    )
      .should('exist')
      .then(() => {
        clickAddDerivxButton()
        verifyDerivxCreation('Real')
        verifyTransferFundsMessage('Real')
        cy.c_switchWalletsAccountDemo()
        clickAddDerivxButton()
        verifyDerivxCreation('Demo')
        verifyTransferFundsMessage('Demo')
      })
  })
})
