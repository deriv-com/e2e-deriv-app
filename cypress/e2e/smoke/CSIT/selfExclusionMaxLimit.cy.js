import '@testing-library/cypress/add-commands'

const username = Cypress.env('loginEmail')
const password = Cypress.env('loginPassword')

Cypress.Commands.add('c_setSelfExclusionValue', (value) => {
  cy.get('input[name="max_open_bets"]').clear().type(value)
  cy.findByRole('button', { name: 'Next' }).click({ force: true })
  cy.findByRole('button', { name: 'Accept' }).click()
})

Cypress.Commands.add('c_clearTrades', () => {
  cy.get('body').then(($body) => {
    if (
      $body
        .text()
        .includes(
          'You have no open positions for this asset. To view other open positions, click Go to Reports'
        )
    ) {
      cy.log('No active trades at the moment')
    } else {
      //cy.contains('.dc-btn--sell', 'Close').each(($ele) => {
      cy.get('.dc-btn--sell').each(($ele) => {
        cy.wrap($ele).click()
      })
    }
  })
})

Cypress.Commands.add('c_openPositionsPanel', () => {
  //cy.findAllByTestId('dt_positions_toggle').should('be.visible')
  cy.findAllByTestId('dt_positions_toggle').click()
})

const screenSizes = ['small']

screenSizes.forEach((screenSize) => {
  describe(`Verify deriv app self exclusion scenarios: ${screenSize}`, () => {
    beforeEach(() => {
      cy.log('Login as user with real account')
      cy.c_login({ rateLimitCheck: true })
      cy.log('navigating to Personal Details page')
      cy.c_visitResponsive('account/self-exclusion', screenSize, {
        rateLimitCheck: true,
      })

      //NEED TO SKIP PASSKEYS OPTIONS FOR MOBILE
      if (screenSize == 'small') {
        cy.c_skipPasskeysV2()
      }
      cy.c_visitResponsive('account/self-exclusion', screenSize, {
        rateLimitCheck: true,
      })
      cy.c_setSelfExclusionValue(0)
      cy.c_visitResponsive('/', screenSize, {
        rateLimitCheck: true,
      })
      cy.c_openPositionsPanel()
      cy.c_clearTrades()

      if (screenSize == 'small') {
        cy.findByTestId('dt_modal_header_close').should('be.visible').click()
      }
    })

    it('Create test for QATEST-116807 Self Exclusion [Options - Turbos]', () => {
      cy.log(Cypress.currentTest.title)
      cy.log('now moving to self exclusion page')

      cy.c_visitResponsive('account/self-exclusion', screenSize, {
        rateLimitCheck: true,
      })

      cy.log('Making sure that Maximum open positions')
      cy.findByText('Maximum open positions').scrollIntoView()

      cy.c_setSelfExclusionValue(1)

      cy.c_visitResponsive('/', screenSize, {
        rateLimitCheck: true,
      })

      cy.findByTestId('dt_contract_dropdown').should('be.visible')
      cy.findByTestId('dt_contract_dropdown').click()

      cy.get('#dt_contract_turboslong_item').should('be.visible')

      cy.log('turbos option visible')
      cy.get('#dt_contract_turboslong_item').click()
      cy.get('#dc_m_toggle_item').click()
      cy.get('#dt_purchase_turboslong_button').click()

      cy.wait(3000)
      if (screenSize == 'small') {
        cy.c_openPositionsPanel()
        cy.findByTestId('dt_modal_header_close').should('be.visible').click()
      }

      //cy.get('.dc-contract-card-item__footer').should('have.length', 1)
      cy.get('#dt_purchase_turboslong_button').click()

      cy.findByText(
        'Sorry, you cannot hold more than 1 contracts at a given time. Please wait until some contracts have closed and try again.'
      ).should('be.visible')

      if (screenSize != 'small') {
        cy.findByRole('button', { name: 'OK' }).click()
      }

      cy.log('Going to validate the number of elements appearing')

      if (screenSize == 'small') {
        cy.c_openPositionsPanel()
      }

      //cy.get('.dc-contract-card-item__footer').should('have.length', 1)
      cy.c_clearTrades()
    })
  })
})
