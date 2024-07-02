describe('QATEST-5724: CFDs - Create a demo Financial account using existing MT5 account password', () => {
  const size = ['small', 'desktop']
  let countryCode = 'co'

  beforeEach(() => {
    cy.c_createCRAccount({ country_code: countryCode })
    cy.c_login()
  })
  size.forEach((size) => {
    it(`Verify I can add a demo financial account using exisiting MT5 derived account password on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('appstore/traders-hub', size)
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
      if (isMobile) cy.c_skipPasskeysV2()
      cy.c_checkTradersHubHomePage(isMobile)
      cy.c_switchToDemo()
      if (isMobile) cy.findByRole('button', { name: 'CFDs' }).click()
      cy.findByTestId('dt_trading-app-card_demo_standard')
        .findByTestId('dt_platform-name')
        .should('have.text', 'Standard')
      cy.findByTestId('dt_trading-app-card_demo_standard')
        .findByRole('button', { name: 'Get' })
        .click()
      cy.findByText('Create a Deriv MT5 password').should('be.visible')
      cy.findByText(
        'You can use this password for all your Deriv MT5 accounts.'
      ).should('be.visible')
      cy.findByTestId('dt_mt5_password').type(
        Cypress.env('credentials').test.mt5User.PSWD,
        {
          log: false,
        }
      )
      cy.findByRole('button', { name: 'Create Deriv MT5 password' }).click()
      cy.findByRole('heading', { name: 'Success!' }).should('be.visible')
      cy.get('.dc-modal-body').should(
        'contain.text',
        'Success!Your demo Deriv MT5 Standard account is ready.'
      )
      cy.findByRole('button', { name: 'Continue' }).click()
      cy.findByTestId('dt_trading-app-card_demo_standard_svg')
        .findByTestId('dt_cfd-account-name')
        .should('have.text', 'Standard')
      cy.findByText('10,000.00 USD').should('be.visible')
      cy.findByRole('button', { name: 'Top up' }).should('exist')
      cy.findByTestId('dt_trading-app-card_demo_financial')
        .findByTestId('dt_platform-name')
        .should('have.text', 'Financial')
      cy.findByTestId('dt_trading-app-card_demo_financial')
        .findByRole('button', { name: 'Get' })
        .click()
      cy.findByText('Enter your Deriv MT5 password').should('be.visible')
      cy.findByText(
        'Enter your Deriv MT5 password to add a MT5 Demo Financial account.'
      ).should('be.visible')
      cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
      cy.findByRole('button', { name: 'Forgot password?' }).should('be.visible')
      //Validate Bad Password
      cy.findByTestId('dt_mt5_password').type(
        Cypress.env('credentials').test.masterUser.PSWD,
        {
          log: false,
        }
      )
      cy.findByRole('button', { name: 'Add account' }).click()
      cy.findByText('That password is incorrect. Please try again.').should(
        'be.visible'
      )
      cy.findByText(
        'Hint: You may have entered your Deriv password, which is different from your Deriv MT5 password.'
      ).should('be.visible')
      cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
      cy.findByRole('button', { name: 'Forgot password?' }).should('be.enabled')
      cy.findByTestId('dt_mt5_password').type(
        Cypress.env('credentials').test.mt5User.PSWD,
        {
          log: false,
        }
      )
      cy.findByRole('button', { name: 'Add account' }).click()
      cy.get('.dc-modal-body').should(
        'contain.text',
        'Success!Your demo Deriv MT5 Financial account is ready.'
      )
      cy.findByRole('button', { name: 'Continue' }).click()
      cy.findByTestId('dt_trading-app-card_demo_financial_svg')
        .findByTestId('dt_cfd-account-name')
        .should('have.text', 'Financial')
      cy.findAllByText('10,000.00 USD').eq(1).should('be.visible')
      cy.findAllByRole('button', { name: 'Top up' }).eq(1).should('exist')
      cy.findByTestId('dt_trading-app-card_demo_financial_svg')
        .findByRole('button', { name: 'Open' })
        .click({ force: true })
      cy.get('div.cfd-trade-modal-container')
        .findByText('Financial')
        .should('be.visible')
      cy.get('div.cfd-trade-modal-container')
        .findByText('Demo')
        .should('be.visible')
      cy.get('div.cfd-trade-modal-container')
        .findByText('Deriv.com Limited')
        .should('be.visible')
    })
  })
})
