function createMT5Account() {
  cy.findByTestId('dt_trading-app-card_real_standard')
    .findByRole('button', { name: 'Get' })
    .click()
  cy.findByText('St. Vincent & Grenadines').click()
  cy.findByRole('button', { name: 'Next' }).click()
  cy.findByText('Create a Deriv MT5 password').should('be.visible')
  cy.findByTestId('dt_mt5_password').type(
    Cypress.env('credentials').test.mt5User.PSWD,
    {
      log: false,
    }
  )
  cy.findByRole('button', { name: 'Create Deriv MT5 password' }).click()
  cy.findByRole('button', { name: 'Maybe later' }).should('be.visible').click()
}

function validateTransferwithZeroBalance() {
  cy.findByRole('button', { name: 'Transfer' }).should('be.visible').click()
  cy.findByRole('heading', { name: 'Transfer funds to your accounts' })
    .should('be.visible')
    .click()
  cy.findByRole('heading', {
    name: 'You have no funds in your USD account',
  }).should('be.visible')
  cy.findByText('Please make a deposit to use this feature.').should(
    'be.visible'
  )
  cy.findByRole('button', { name: 'Deposit now' }).should('be.visible').click()
  cy.url().should('contain', 'cashier/deposit')
  cy.findByText('Deposit via bank wire, credit card, and e-wallet').should(
    'be.visible'
  )
}

function validateTransferwithBalance() {
  cy.findByRole('button', { name: 'Transfer' }).should('be.visible').click()
  cy.findByRole('heading', { name: 'Transfer funds to your accounts' })
    .should('be.visible')
    .click()
  cy.findByTestId('dt_account_transfer_form_input').click().type('10')
  cy.get('.account-transfer-form__submit-button').click()
  cy.findByRole('heading', {
    name: 'Your funds have been transferred',
  }).should('be.visible')
  cy.get('.crypto-transfer-from-details').contains('USD')
  cy.findByText('Close').should('be.visible')
  cy.findByRole('button', { name: 'View transaction details' })
    .should('be.visible')
    .click()
  cy.url().should('contain', 'reports/statement')
}

describe('QATEST-6064 Validate the transfer from CR to MT5 when CR account is having account balance', () => {
  beforeEach(() => {
    cy.c_login()
  })
  it('Should validate the transfer functionality from CR to MT5 account when CR account is having balance in desktop ', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
    //Only create new mt5 account if it doesn't exist
    cy.findByTestId('dt_traders_hub')
      .findByText('Deriv MT5')
      .should('be.visible')
    cy.findByTestId('dt_trading-app-card_real_standard')
      .should(() => {})
      .findByRole('button', {
        name: 'Get',
      })
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          createMT5Account()
          cy.log('Added MT5 Account')
        } else cy.log('MT5 account already exists')
      })
    validateTransferwithBalance()
  })

  it('Should validate the transfer functionality from CR to MT5 account when CR account is having balance in mobile ', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
    //Wait for page to load
    cy.findByTestId('dt_trading-app-card_real_deriv-trader')
      .findByText('Deriv Trader')
      .should('be.visible')
    cy.c_skipPasskeysV2()
    cy.c_closeNotificationHeader()
    cy.findByRole('button', { name: 'CFDs' }).click()
    validateTransferwithBalance()
  })
})

describe('QATEST-6060 Validate the transfer from CR to MT5 when CR account is not having account balance', () => {
  beforeEach(() => {
    cy.c_createCRAccount()
    cy.c_login()
  })
  it('Should validate the transfer functionality from CR to MT5 account when CR account is not having balance in desktop ', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    createMT5Account()
    validateTransferwithZeroBalance()
  })

  it('Should validate the transfer functionality from CR to MT5 account when CR account is not having balance in mobile ', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
    //Wait for page to load
    cy.findByTestId('dt_trading-app-card_real_deriv-trader')
      .findByText('Deriv Trader')
      .should('be.visible')
    cy.c_skipPasskeysV2()
    cy.c_closeNotificationHeader()
    cy.findByRole('button', { name: 'CFDs' }).click()
    createMT5Account()
    validateTransferwithZeroBalance()
  })
})
