import '@testing-library/cypress/add-commands'

function clickAddMt5Button() {
  cy.get('.wallets-available-mt5__details')
    .next('.wallets-trading-account-card__content > .wallets-button')
    .first()
    .click()
}

function verifyJurisdictionSelection(accountType) {
  cy.findByText(
    `Choose a jurisdiction for your Deriv MT5 ${accountType} account`,
    { exact: true }
  ).should('be.visible')
  cy.findByText('St. Vincent & Grenadines').click()
  cy.findByRole('button', { name: 'Next' }).click()
}
function selectBVIJurisdiction(accountType) {
  cy.findByText(
    `Choose a jurisdiction for your Deriv MT5 ${accountType} account`
  ).should('be.visible')
  cy.findByText('British Virgin Islands', { exact: true }).click()
  cy.findByText('I confirm and accept Deriv (BVI) Ltd‘s').click()
  cy.findByRole('button', { name: 'Next' }).click()
}
function verifyDerivMT5Creation(accountType) {
  let expectedText
  if (accountType === 'Derived') {
    expectedText = 'Create a Deriv MT5'
    cy.get('div').contains(expectedText).should('be.visible')
    cy.findByPlaceholderText('Deriv MT5 password')
      .click()
      .type(Cypress.env('mt5Password'))
    cy.findByRole('button', { name: 'Create Deriv MT5 password' }).click()
  } else {
    expectedText = 'Enter your Deriv MT5 password' // Adjust this text based on your actual requirement
    cy.get('div').contains(expectedText).should('be.visible')
    cy.findByPlaceholderText('Deriv MT5 password')
      .click()
      .type(Cypress.env('mt5Password'))
    cy.findByRole('button', { name: 'Add account' }).click()
  }
}

function verifyTransferFundsMessage(accountType) {
  cy.findByText(
    `Transfer funds from your USD Wallet to your ${accountType} (SVG) account to start trading.`
  ).should('be.visible')
  cy.get(
    `div:contains("MT5 ${accountType} (SVG)USD Wallet0.00 USDYour ${accountType} (SVG) account is ready")`
  )
    .eq(2)
    .should('be.visible')
}

function verifyDemoCreationsMessage(accountType) {
  cy.findByText(`Your ${accountType} demo account is ready`).should(
    'be.visible'
  )
  cy.findByText(
    `Let's practise trading with 10,000.00 USD virtual funds.`
  ).should('be.visible')
  cy.findByRole('button', { name: 'OK' }).click()
}

function expandDemoWallet() {
  cy.findByText('Demo').scrollIntoView()
  cy.get('[class*="virtual"].wallets-accordion__header--virtual')
    .find('.wallets-accordion__dropdown > svg')
    .click()
}
function closeModal() {
  cy.findByRole('button', { name: 'Maybe later' }).should('exist')
  cy.findByRole('button', { name: 'Transfer funds' }).should('exist')
  cy.findByRole('button', { name: 'Maybe later' }).click()
}
describe('WALL-2000 - Create MT5 account', () => {
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to create mt5 svg account', () => {
    cy.log('create mt5 svg account')
    cy.findByText('CFDs', { exact: true }).should('be.visible')

    clickAddMt5Button()
    verifyJurisdictionSelection('Derived')
    verifyDerivMT5Creation('Derived')
    verifyTransferFundsMessage('Derived')
    closeModal()
    clickAddMt5Button()
    verifyJurisdictionSelection('Financial')
    verifyDerivMT5Creation('Financial')
    verifyTransferFundsMessage('Financial')
    closeModal()

    // this part is commented due to this bug [https://app.clickup.com/t/20696747/WALL-3302]
    // clickAddMt5Button()
    // verifyJurisdictionSelection('Swap-Free')
    // verifyDerivMT5Creation('Swap-Free')
    // verifyTransferFundsMessage('Swap-Free')
    //closeModal()
    // create SVG Financial account

    cy.findByText('Get more', { exact: true }).click()
    cy.findByText('Select Deriv MT5’s account type').should('be.visible')
    cy.get('.wallets-mt5-account-type-card-list-content').first().click()
    cy.findByRole('button', { name: 'Next' }).click()
    selectBVIJurisdiction('Derived')
    cy.findByRole('heading', { name: 'Complete your personal details' }).should(
      'exist'
    )
    cy.findByPlaceholderText('Tax residence*').click()
    cy.findByPlaceholderText('Tax residence*').type('Indonesi')
    cy.findByRole('option', { name: 'Indonesia' }).click()
    cy.findByLabelText('Tax identification number*').click()
    cy.findByLabelText('Tax identification number*').type('001234212343232')
    cy.findByRole('button', { name: 'Next' }).click()
    verifyDerivMT5Creation('BVI')
    closeModal()

    // Create Demo MT5 accounts
    cy.log('create demo mt5 svg account')
    expandDemoWallet()
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    clickAddMt5Button()
    verifyDerivMT5Creation('Demo')
    verifyDemoCreationsMessage('Derived')

    cy.log('create demo mt5 svg financial account')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    clickAddMt5Button()
    verifyDerivMT5Creation('Demo')
    verifyDemoCreationsMessage('Financial')

    // this part is commented due to this bug [https://app.clickup.com/t/20696747/WALL-3302]
    // cy.log("create demo mt5 svg swap free account")
    // cy.findByText("CFDs", { exact: true }).should("be.visible")
    // clickAddMt5Button()
    // verifyDerivMT5Creation('Demo')
    // verifyDemoCreationsMessage('Swap-Free')
  })
})
