import '@testing-library/cypress/add-commands'

function clickAddMt5Button(mt5AccountType) {
  // cy.get('.wallets-available-mt5__details')
  //   .next('.wallets-trading-account-card__content > .wallets-button')
  //   .first()
  //   .click()
  cy.get('span.wallets-text').contains(mt5AccountType).click()
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
  cy.get('.wallets-dropdown__button').click()
  cy.get('.wallets-list-card-dropdown__item-content')
    .contains('USD Demo Wallet')
    .click()
  cy.contains('USD Demo Wallet').should('be.visible')
}
function closeModal() {
  cy.findByRole('button', { name: 'Maybe later' }).should('exist')
  cy.findByRole('button', { name: 'Transfer funds' }).should('exist')
  cy.findByRole('button', { name: 'Maybe later' }).click()
}
describe('QATEST-98638 - Add Real SVG MT5 account and QATEST-98818 Add demo SVG MT5 account and QATEST-115487 Add real BVI MT5 account', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletloginEmail' })
    cy.c_visitResponsive('/', 'large')
  })

  it('should be able to create mt5 svg account', () => {
    const mt5SVG = 'CFDs on derived instruments.'
    cy.log('create mt5 svg account')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    cy.findByText('CFDs on derived instruments.')
      .should('exist')
      .then(() => {
        clickAddMt5Button(mt5SVG)
        verifyJurisdictionSelection('Derived')
        verifyDerivMT5Creation('Derived')
        verifyTransferFundsMessage('Derived')
        closeModal()
      })
    cy.findByText('CFDs on financial instruments.')
      .should('exist')
      .then(() => {
        const mt5FIN = 'CFDs on financial instruments.'
        clickAddMt5Button(mt5FIN)
        verifyJurisdictionSelection('Financial')
        verifyDerivMT5Creation('Financial')
        verifyTransferFundsMessage('Financial')
        closeModal()
      })
    // this part is commented due to this bug [https://app.clickup.com/t/20696747/WALL-3302]
    // cy,findByText('Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs').then(()=>{
    // clickAddMt5Button()
    // verifyJurisdictionSelection('Swap-Free')
    // verifyDerivMT5Creation('Swap-Free')
    // verifyTransferFundsMessage('Swap-Free')
    // closeModal()
    // })

    //Below flow is also different with current MT5 flow. need to check and confirm on latest behavior.As per new flow cannot add more than 1 MT5 svg account
    // create SVG Financial account
    // const getMoreText = Cypress.$(":contains('Get more')")
    // if (getMoreText.length > 0) {
    //   cy.findByText('Get more', { exact: true }).click()
    //   cy.findByText('Select Deriv MT5’s account type').should('be.visible')
    //   cy.get('.wallets-mt5-account-type-card-list-content').first().click()
    //   cy.findByRole('button', { name: 'Next' }).click()
    //   selectBVIJurisdiction('Derived')
    //   cy.findByRole('heading', {
    //     name: 'Complete your personal details',
    //   }).should('exist')
    //   cy.findByPlaceholderText('Tax residence*').click()
    //   cy.findByPlaceholderText('Tax residence*').type('Indonesi')
    //   cy.findByRole('option', { name: 'Indonesia' }).click()
    //   cy.findByLabelText('Tax identification number*').click()
    //   cy.findByLabelText('Tax identification number*').type('001234212343232')
    //   cy.findByRole('button', { name: 'Next' }).click()
    //   verifyDerivMT5Creation('BVI')
    //   closeModal()
    // }
    // Create Demo MT5 accounts
    cy.log('create demo mt5 svg account')
    cy.c_switchWalletsAccount('USD Demo')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    cy.findByText('CFDs on derived instruments.')
      .should('exist')
      .then(() => {
        clickAddMt5Button(mt5SVG)
        verifyDerivMT5Creation('Demo')
        verifyDemoCreationsMessage('Derived')
      })

    //As per new flow cannot add more than 1 MT5 svg account
    // cy.log('create demo mt5 svg financial account')
    // cy.findByText('CFDs', { exact: true }).should('be.visible')
    // const demoFinancialText = Cypress.$(
    //   ":contains('This account offers CFDs on derived instruments.')"
    // )
    // if (demoFinancialText.length > 0) {
    //   clickAddMt5Button()
    //   verifyDerivMT5Creation('Demo')
    //   verifyDemoCreationsMessage('Financial')
    // }
    // this part is commented due to this bug [https://app.clickup.com/t/20696747/WALL-3302]
    // cy.log("create demo mt5 svg swap free account")
    // cy.findByText("CFDs", { exact: true }).should("be.visible")
    // clickAddMt5Button()
    // verifyDerivMT5Creation('Demo')
    // verifyDemoCreationsMessage('Swap-Free')
  })
})
