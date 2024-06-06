import '@testing-library/cypress/add-commands'

function resetBalanceDemo(platform) {
  if (`${platform}` == `mobile`) {
    cy.c_switchWalletsAccountDemo()
    cy.contains('Reset balance', { timeout: 10000 }).should('be.visible')
    cy.findByText('Reset balance').parent().click()
  } else {
    cy.c_switchWalletsAccount('USD Demo')
    cy.findByText('Reset balance').should('be.visible').click()
  }
  cy.get('[class="wallets-cashier-content"]')
    .findByRole('button', { name: 'Reset balance' })
    .click()
  cy.findByText('Success').should('exist')
  cy.findByRole('button', { name: 'Transfer funds' }).click()
  //To check if Transfer tab is active on clicking Transfer funds
  cy.findByRole('main')
    .findByRole('button', { name: 'Transfer' })
    .should('be.visible')
    .invoke('attr', 'class') //would return the string of that class
    .should('include', 'wallets-cashier-header__tab--active') //find if the class has "active" string
}

function demoTransfer(transferToAccount) {
  cy.findByText(/Transfer to/).click()
  const transferToText = Cypress.$(`:contains(${transferToAccount})`)
  if (transferToText.length > 0) {
    cy.findByText(transferToAccount).click()
    cy.get('input[class="wallets-atm-amount-input__input"]')
      .eq(1)
      .click()
      .type('1.000')
    cy.get('form')
      .findByRole('button', { name: 'Transfer', exact: true })
      .should('be.enabled')
      .click()
    cy.findByText('Your transfer is successful!', {
      exact: true,
    }).should('be.visible')
    cy.findByRole('button', { name: 'Make a new transfer' }).click()
    cy.findByText(/Transfer from/)
  } else {
    cy.get('.wallets-transfer-form-account-selection__close-button').click()
  }
}

describe('QATEST-98798 - Transfer and QATEST-98801 View demo transaction', () => {
  //Prerequisites: Demo wallet account in any qa box with USD demo funds
  beforeEach(() => {
    cy.c_login({ user: 'walletloginEmail' })
  })

  let firstAccount = /MT5 Derived/
  let secondAccount = /Deriv X/

  it('should be able to transfer demo funds', () => {
    cy.log('Transfer Demo Funds for Demo Account')
    cy.c_visitResponsive('/', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    resetBalanceDemo('desktop')
    cy.findByText(/Transfer from/).click()
    cy.get('button[class=wallets-transfer-form-account-selection__account]')
      .last()
      .click()
    demoTransfer(firstAccount)
    cy.findByText(/Transfer from/).click()
    cy.get('button[class=wallets-transfer-form-account-selection__account]')
      .last()
      .click()
    demoTransfer(secondAccount)
  })

  it('should be able to view demo transactions', () => {
    cy.log('View Transactions for Demo Account')
    cy.c_visitResponsive('/', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    resetBalanceDemo('desktop')
    cy.findByRole('button', { name: 'Transactions' }).click()
    cy.findByTestId('dt_wallets_textfield_icon_right')
      .findByRole('button')
      .click()
    cy.findByRole('option', { name: 'Reset balance' }).click()
    cy.findByText('+10,000.00 USD')
    cy.findByTestId('dt_wallets_textfield_icon_right')
      .findByRole('button')
      .click()
    cy.findByRole('option', { name: 'Transfer' }).click()
    const firstAccountText = Cypress.$(`:contains(${firstAccount})`)
    if (firstAccountText.length > 0) {
      cy.findAllByText(firstAccount).first().should('be.visible')
      cy.findAllByText(/-10.00 USD/)
        .first()
        .should('be.visible')
    }
    const secondAccountText = Cypress.$(`:contains(${secondAccount})`)
    if (secondAccountText.length > 0) {
      cy.findAllByText(secondAccount).first().should('be.visible')
      cy.findAllByText(/-10.00 USD/)
        .first()
        .should('be.visible')
    }
  })

  it('should be able to transfer demo funds in responsive', () => {
    cy.log('Transfer Demo Funds for Demo Account in responsive')
    cy.c_visitResponsive('/', 'small')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_skipPasskeysV2()
    resetBalanceDemo('mobile')
    cy.findByText(/Transfer from/).click()
    cy.get('button[class=wallets-transfer-form-account-selection__account]')
      .last()
      .click()
    demoTransfer(firstAccount)
    cy.findByText(/Transfer from/).click()
    cy.get('button[class=wallets-transfer-form-account-selection__account]')
      .last()
      .click()
    demoTransfer(secondAccount)
  })

  it('should be able to view demo transactions in responsive', () => {
    cy.log('View Transactions for Demo Account in responsive')
    cy.c_visitResponsive('/', 'small')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_skipPasskeysV2()
    resetBalanceDemo('mobile')
    cy.findByRole('button', { name: 'Transactions' }).click()
    cy.findByTestId('dt_wallets_textfield_icon_right')
      .findByRole('button')
      .click()
    cy.findByRole('option', { name: 'Reset balance' }).click()
    cy.findByText('+10,000.00 USD')
    cy.findByTestId('dt_wallets_textfield_icon_right')
      .findByRole('button')
      .click()
    cy.findByRole('option', { name: 'Transfer' }).click()
    const firstAccountText = Cypress.$(`:contains(${firstAccount})`)
    if (firstAccountText.length > 0) {
      cy.findAllByText(firstAccount).first().should('be.visible')
      cy.findAllByText(/-10.00 USD/)
        .first()
        .should('be.visible')
    }
    const secondAccountText = Cypress.$(`:contains(${secondAccount})`)
    if (secondAccountText.length > 0) {
      cy.findAllByText(secondAccount).first().should('be.visible')
      cy.findAllByText(/-10.00 USD/)
        .first()
        .should('be.visible')
    }
  })
})
