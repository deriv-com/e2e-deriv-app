describe('QATEST-6032: Create MT5 account without using the existing MT5 password for the user(negative scenario)', () => {
  const size = ['small', 'desktop']
  let countryCode = 'co'

  beforeEach(() => {
    cy.c_createCRAccount({ country_code: countryCode })
    cy.c_login()
  })
  size.forEach((size) => {
    it(`Verify the negative scenario of adding MT5 financial account with wrong password when there is already an MT5 Standard account added on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('appstore/traders-hub', size)
      if (isMobile) cy.c_skipPasskeysV2()
      cy.c_checkTradersHubHomePage(isMobile)
      if (isMobile) cy.findByRole('button', { name: 'CFDs' }).click()
      cy.findByTestId('dt_trading-app-card_real_standard')
        .findByRole('button', { name: 'Get' })
        .click()
      cy.findByText('St. Vincent & Grenadines').click()
      cy.findByRole('button', { name: 'Next' }).click()

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
      cy.get('.dc-modal-body').should(
        'contain.text',
        'Success!Your Deriv MT5 Standard account is ready. Enable trading with your first transfer.'
      )
      cy.findByRole('button', { name: 'Transfer now' }).should('exist')
      cy.findByRole('button', { name: 'Maybe later' }).click()
      cy.findByText('0.00 USD').should('be.visible')
      cy.findByRole('button', { name: 'Transfer' }).should('exist')
      cy.findByTestId('dt_trading-app-card_real_financial')
        .findByRole('button', { name: 'Get' })
        .click()
      cy.findByText('St. Vincent & Grenadines').click()
      cy.findByRole('button', { name: 'Next' }).click()
      cy.findByText('Enter your Deriv MT5 password').should('be.visible')
      cy.findByText(
        'Enter your Deriv MT5 password to add a MT5 Financial SVG account.'
      ).should('be.visible')
      cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
      cy.findByRole('button', { name: 'Forgot password?' }).should('be.visible')
      cy.findByTestId('dt_mt5_password').type('gfdGHFD@123')
      cy.findByRole('button', { name: 'Add account' }).click()
      cy.findByText('That password is incorrect. Please try again.').should(
        'be.visible'
      )
      cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
      cy.findByRole('button', { name: 'Forgot password?' }).click()
      cy.findByText(
        'Please click on the link in the email to reset your password.'
      ).should('be.visible')
      cy.findByRole('button', { name: "Didn't receive the email?" }).should(
        'be.visible'
      )
    })
  })
})
