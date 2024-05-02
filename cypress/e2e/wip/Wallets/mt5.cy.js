import '@testing-library/cypress/add-commands'

function clickAddMt5Button(accountType) {
  cy.findByText(`${accountType}`).click()
}

function verifyJurisdictionSelection(accountType, jurisdiction) {
  cy.findByText(
    `Choose a jurisdiction for your Deriv MT5 ${accountType} account`,
    { exact: true }
  ).should('be.visible')
  cy.findByText(jurisdiction).click()
  cy.findByRole('button', { name: 'Next' }).click()
}

function verifyDerivMT5Creation(accountType, buttonText, expectedText) {
  cy.get('div').contains(expectedText).should('be.visible')
  cy.findByPlaceholderText('Deriv MT5 password')
    .click()
    .type(Cypress.env('mt5Password'))
  cy.findByRole('button', { name: buttonText }).click()
}

function verifyTransferFundsMessage(accountType, jurisdiction) {
  cy.findByText(
    `Transfer funds from your USD Wallet to your ${accountType} (${jurisdiction}) account to start trading.`
  ).should('be.visible')
  cy.get(
    `div:contains("MT5 ${accountType} (${jurisdiction})USD Wallet0.00 USDYour ${accountType} (${jurisdiction}) account is ready")`
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
    cy.c_login({ app: 'wallets' })
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to create mt5 svg account', () => {
    cy.log('create mt5 svg account')
    cy.findByText('CFDs', { exact: true }).should('be.visible')

    const accountTypes = ['Derived', 'Financial']
    const jurisdictions = ['St. Vincent & Grenadines', 'British Virgin Islands']
    const buttonTexts = ['Create Deriv MT5 password', 'Add account']
    const expectedTexts = [
      'Create a Deriv MT5',
      'Enter your Deriv MT5 password',
    ]

    accountTypes.forEach((accountType, index) => {
      const svgText = Cypress.$(
        `:contains('This account offers CFDs on ${accountType.toLowerCase()} instruments.')`
      )
      if (svgText.length > 0) {
        clickAddMt5Button(accountType)
        verifyJurisdictionSelection(accountType, jurisdictions[index])
        verifyDerivMT5Creation(
          accountType,
          buttonTexts[index],
          expectedTexts[index]
        )
        verifyTransferFundsMessage(accountType, jurisdictions[index])
        closeModal()
      }
    })

    const getMoreText = Cypress.$(":contains('Get more')")
    if (getMoreText.length > 0) {
      cy.findByText('Get more', { exact: true }).click()
      cy.findByText('Select Deriv MT5’s account type').should('be.visible')
      cy.get('.wallets-mt5-account-type-card-list-content').first().click()
      cy.findByRole('button', { name: 'Next' }).click()
      selectBVIJurisdiction('Derived')
      cy.findByRole('heading', {
        name: 'Complete your personal details',
      }).should('exist')
      cy.findByPlaceholderText('Tax residence*').click()
      cy.findByPlaceholderText('Tax residence*').type('Indonesi')
      cy.findByRole('option', { name: 'Indonesia' }).click()
      cy.findByLabelText('Tax identification number*').click()
      cy.findByLabelText('Tax identification number*').type('001234212343232')
      cy.findByRole('button', { name: 'Next' }).click()
      verifyDerivMT5Creation('BVI')
      closeModal()
    }

    cy.log('create demo mt5 svg account')
    expandDemoWallet()
    cy.findByText('CFDs', { exact: true }).should('be.visible')

    const demoAccountTypes = ['Derived', 'Financial']
    demoAccountTypes.forEach((accountType) => {
      const demoSvgText = Cypress.$(
        `:contains('This account offers CFDs on ${accountType.toLowerCase()} instruments.')`
      )
      if (demoSvgText.length > 0) {
        clickAddMt5Button()
        verifyDerivMT5Creation('Demo', 'OK', 'Create a Deriv MT5')
        verifyDemoCreationsMessage(accountType)
      }
    })

    // Uncommented lines
    // cy,findByText('Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs').then(()=>{
    // clickAddMt5Button()
    // verifyJurisdictionSelection('Swap-Free')
    // verifyDerivMT5Creation('Swap-Free')
    // verifyTransferFundsMessage('Swap-Free')
    // closeModal()
    // })
  })
})
