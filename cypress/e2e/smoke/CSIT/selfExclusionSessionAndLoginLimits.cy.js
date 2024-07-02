const addDays = (n) => {
  let myDate = new Date()
  myDate.setDate(myDate.getDate() + n)
  return myDate.toISOString().slice(0, 10)
}

const BO_URL = `https://${Cypress.env('configServer')}${Cypress.env('qaBOEndpoint')}`
const size = ['small', 'desktop']

describe('QATEST-116798 Self Exclusion Session and login limits', () => {
  beforeEach(() => {
    cy.c_visitResponsive('/')
    cy.c_createCRAccount()
    cy.c_login()
  })

  size.forEach((size) => {
    it(`Should login, set self exclusion, verify it's applied, check from BO side, remove it from BO and verify restrictions are removed from FE side on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      /* Sets self exclusion on FE */
      cy.c_visitResponsive('/account/self-exclusion', size)

      if (size == 'small') {
        cy.findByRole('heading', {
          name: 'Your session and login limits',
        }).scrollIntoView()
        cy.get("input[type='Date']")
          .first()
          .type(`${addDays(40)}`)
      } else {
        cy.findAllByLabelText('Date').first().click()
        cy.get(`[data-date='${addDays(40)}']`).click()
      }
      cy.findByRole('button', { name: 'Next' }).click({ force: true })
      cy.findByRole('button', { name: 'Accept' }).click()
      cy.findByRole('button', { name: 'Yes, log me out immediately' }).click()

      /* Checks self exclusion is saved on FE */
      cy.c_login()
      cy.c_visitResponsive('/appstore/traders-hub', size)
      cy.findByTestId('dt_dropdown_display', { timeout: 10000 }).should('exist')
      cy.findByTestId('dt_dropdown_display').click()
      cy.get('#real', { timeout: 10000 }).should('exist')
      cy.get('#real').click()
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2') // waits until Real account is loaded
      cy.c_visitResponsive('/account/self-exclusion', size)
      cy.get('input[name="timeout_until"]').should('not.be.empty')

      /* Checks cannot create account */
      cy.c_visitResponsive('/appstore/traders-hub', size)

      if (size == 'small') {
        cy.findByRole('button', { name: 'CFDs' }).click()
      }

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
        Cypress.env('credentials').test.diel.PSWD
      )
      cy.findByRole('button', { name: 'Create Deriv MT5 password' }).click()
      cy.get('.dc-dialog__dialog').should(
        'contain.text',
        'Something’s not right'
      )

      /* Checks Deposit is locked */
      cy.c_visitResponsive('/cashier/deposit', size)
      cy.get('.empty-state').should('be.visible')

      /* Checks Trade is unavailable */
      cy.c_visitResponsive(
        '/?chart_type=area&interval=1t&symbol=1HZ100V&trade_type=multiplier',
        size
      )
      cy.findByRole(
        'button',
        { name: 'Up 10.00 USD' },
        { timeout: 30000 }
      ).should('exist')
      cy.findByRole('button', { name: 'Up 10.00 USD' }).click()

      if (size == 'small') {
        cy.get('[class="dc-toast__message"]').should('be.visible')
      } else {
        cy.get('.dc-modal-body').should('be.visible')
      }

      /* Visits BO */
      cy.c_visitResponsive('/', size)
      cy.visit(BO_URL)
      cy.findByText('Please login.').click()
      cy.findByText('Client Management').click()
      cy.findByPlaceholderText('email@domain.com')
        .should('exist')
        .clear()
        .type(Cypress.env('credentials').test.masterUser.ID)
      cy.findByRole('button', { name: /View \/ Edit/i }).click()
      cy.get('.link').eq(1).should('be.visible').click()

      /* Clears self exclusion date from BO */
      cy.findByRole('link', {
        name: 'SELF-EXCLUSION SETTINGS',
        exact: true,
      }).click()
      cy.get('#self-exclusion.btn.btn--primary').click()
      cy.findByText('Timeout from the website until').scrollIntoView()
      cy.findByLabelText('Timeout from the website until').clear()
      cy.findByRole('button', { name: 'Update Settings' }).click()
      cy.get('[class="success"]').should('be.visible')

      /* Checks can create account */
      cy.c_visitResponsive('/appstore/traders-hub', size)

      if (size == 'small') {
        cy.findByTestId('dt_dropdown_display', { timeout: 10000 }).should(
          'exist'
        )
        cy.findByTestId('dt_dropdown_display').click()
        cy.get('#real', { timeout: 10000 }).should('exist')
        cy.get('#real').click()
        cy.findAllByTestId('dt_balance_text_container').should(
          'have.length',
          '2'
        ) // waits until Real account is loaded
        cy.findByRole('button', { name: 'CFDs' }).click()
      }

      cy.findByTestId('dt_trading-app-card_real_standard')
        .findByRole('button', { name: 'Get' })
        .click()
      cy.findByText('St. Vincent & Grenadines').click()
      cy.findByRole('button', { name: 'Next' }).click()
      cy.findByTestId('dt_mt5_password').type(
        Cypress.env('credentials').test.diel.PSWD
      )
      cy.findByRole('button', { name: 'Add account' }).click()
      cy.get('.dc-modal-body').should(
        'contain.text',
        'Success!Your Deriv MT5 Standard account is ready. Enable trading with your first transfer.'
      )

      /* Checks Deposit is not locked */
      cy.c_visitResponsive('/cashier/deposit', size)
      cy.findByText('Deposit via bank wire, credit card, and e-wallet').should(
        'be.visible'
      )

      /* Checks Trade is available */
      cy.c_visitResponsive(
        '/?chart_type=area&interval=1t&symbol=1HZ100V&trade_type=multiplier',
        size
      )
      cy.findByRole(
        'button',
        { name: 'Up 10.00 USD' },
        { timeout: 30000 }
      ).should('exist')
      cy.findByRole('button', { name: 'Up 10.00 USD' }).click()

      if (size == 'small') {
        cy.get('[class="dc-toast__message"]').should('not.be.visible')
      } else {
        cy.findByRole('heading', { name: 'Insufficient balance' }).should(
          'be.visible'
        )
      }
    })
  })
})
