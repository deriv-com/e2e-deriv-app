import '@testing-library/cypress/add-commands'

Cypress.Commands.add('c_setSelfExclusionMaxOptionsTo', (value) => {
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
      cy.get('.dc-btn--sell').each(($ele) => {
        cy.wrap($ele).click()
      })
    }
  })
})

Cypress.Commands.add('c_openPositionsPanel', () => {
  cy.c_rateLimit({
    waitTimeAfterError: 15000,
    isLanguageTest: true,
    maxRetries: 5,
  })
  cy.findAllByTestId('dt_positions_toggle').click()
})

const screenSizes = ['small', 'desktop']

screenSizes.forEach((screenSize) => {
  describe(`QATEST-116807 - Verify maximum open positions setting for self exclusion: ${screenSize}`, () => {
    beforeEach(() => {
      cy.clearAllCookies()
      cy.clearAllLocalStorage()
      cy.clearAllSessionStorage()
      let cypressContext = Cypress.currentTest.title
      cy.log(cypressContext)

      if (!cypressContext.includes('Turbos')) {
        cy.c_login({ user: 'selfExclusionOptions', rateLimitCheck: true })
      } else {
        cy.c_login({ user: 'selfExclusion', rateLimitCheck: true })
      }

      if (screenSize == 'small') {
        cy.log('NEED TO SKIP PASSKEYS OPTIONS FOR MOBILE')
        cy.c_skipPasskeysV2()
      }
      cy.c_visitResponsive('account/self-exclusion', screenSize, {
        rateLimitCheck: true,
      })

      cy.c_setSelfExclusionMaxOptionsTo(0)
      cy.c_visitResponsive('/', screenSize, {
        rateLimitCheck: true,
      })

      cy.contains('button', 'Open').eq(0).click()
      cy.c_openPositionsPanel()
      cy.c_clearTrades()

      if (screenSize == 'small') {
        cy.findByTestId('dt_modal_header_close').should('be.visible').click()
      }
    })

    it('validates maximum open positions setting for trade type [Options - Turbos]', () => {
      cy.c_visitResponsive('account/self-exclusion', screenSize, {
        rateLimitCheck: true,
      })

      cy.log('Making sure that Maximum open positions')
      cy.findByText('Maximum open positions').scrollIntoView()

      cy.c_setSelfExclusionMaxOptionsTo(1)

      cy.c_visitResponsive('/', screenSize, {
        rateLimitCheck: true,
      })

      cy.contains('button', 'Open').eq(0).click()
      cy.findByTestId('dt_contract_dropdown').should('be.visible')
      cy.findByTestId('dt_contract_dropdown').click()

      cy.get('#dt_contract_turboslong_item').should('be.visible')

      cy.log('TURBOS OPTION VISIBLE')
      cy.get('#dt_contract_turboslong_item').click()

      if (screenSize == 'small') {
        cy.get('#duration_amount_selector').click()
        cy.contains('.trade-params__header-label', 'Duration').click()
        cy.contains('.dc-tabs__item', 'Minutes').click()
        cy.contains('.dc-text', 'OK').click()
      } else {
        cy.get('#dc_m_toggle_item').click()
      }

      cy.get('#dt_purchase_turboslong_button').click()

      if (screenSize == 'small') {
        cy.c_openPositionsPanel()
        cy.get('.dc-contract-card-item__footer').should('have.length', 1)
        cy.findByTestId('dt_modal_header_close').should('be.visible').click()
      } else {
        cy.get('.dc-contract-card-item__footer').should('have.length', 1)
      }
      cy.log('TRY TO MAKE SECOND TRADE')
      cy.get('#dt_purchase_turboslong_button').click()

      cy.findByText(
        'Sorry, you cannot hold more than 1 contracts at a given time. Please wait until some contracts have closed and try again.'
      ).should('be.visible')

      if (screenSize != 'small') {
        cy.log('CLOSE THE TRADE PANEL ON MOBILE RESOLTION')
        cy.findByRole('button', { name: 'OK' }).click()
      }

      if (screenSize == 'small') {
        cy.c_openPositionsPanel()
      }
      cy.log('VALIDATE THE NUMBER OF OPEN TRADE POSITIONS')
      cy.get('.dc-contract-card-item__footer').should('have.length', 1)
      cy.c_clearTrades()
    })

    it('validates maximum open positions setting for trade type [Multipliers - Multipliers]', () => {
      cy.c_visitResponsive('account/self-exclusion', screenSize, {
        rateLimitCheck: true,
      })

      cy.log('Making sure that Maximum open positions')
      cy.findByText('Maximum open positions').scrollIntoView()

      cy.c_setSelfExclusionMaxOptionsTo(1)

      cy.c_visitResponsive('/', screenSize, {
        rateLimitCheck: true,
      })

      cy.contains('button', 'Open').eq(0).click()
      cy.findByTestId('dt_contract_dropdown').should('be.visible')
      cy.findByTestId('dt_contract_dropdown').click()

      cy.get('#dt_contract_multiplier_item > span').should('be.visible')

      cy.log('MULTIPLIER OPTION VISIBLE')
      cy.get('#dt_contract_multiplier_item > span').click()

      cy.get('#dt_purchase_multup_button').click()

      if (screenSize == 'small') {
        cy.c_openPositionsPanel()
        cy.get('.dc-contract-card-item__footer').should('have.length', 1)
        cy.findByTestId('dt_modal_header_close').should('be.visible').click()
      } else {
        cy.get('.dc-contract-card-item__footer').should('have.length', 1)
      }
      cy.log('TRY TO MAKE SECOND TRADE')
      cy.get('#dt_purchase_multup_button').click()

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
      cy.log('VALIDATE THE NUMBER OF OPEN TRADE POSITIONS')
      cy.get('.dc-contract-card-item__footer').should('have.length', 1)
      cy.c_clearTrades()
    })
  })
})
