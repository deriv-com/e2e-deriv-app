import '@testing-library/cypress/add-commands'

const username = Cypress.env('loginEmail')
const password = Cypress.env('loginPassword')

Cypress.Commands.add('c_resetSelfEval', () => {
  cy.get('input[name="max_open_bets"]').clear().type(0)
  cy.findByRole('button', { name: 'Next' }).click({ force: true })
  cy.findByRole('button', { name: 'Accept' }).click()
})

Cypress.Commands.add('c_clearTrades', () => {
  cy.wait(2000)
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
      cy.contains('.dc-btn--sell', 'Close').each(($ele) => {
        cy.wrap($ele).click()
      })
    }
  })
  cy.findByTestId('dt_modal_header_close').should('be.visible').click()
})

describe('Verify deriv app self exclusion scenarios: small', () => {
  beforeEach(() => {
    cy.log('Login as user with real account')
    //cy.c_createRealAccount()
    cy.c_login()
    cy.log('navigating to Personal Details page')
    cy.c_visitResponsive('account/self-exclusion', 'small')
    cy.c_resetSelfEval()
    cy.c_visitResponsive('/', 'small')
    cy.wait(2000)
    cy.findAllByTestId('dt_positions_toggle').should('be.visible')
    cy.findAllByTestId('dt_positions_toggle').click()
    cy.c_clearTrades()
  })

  it('Create test for QATEST-116807 Self Exclusion [Your max account balance & open positions]: small', () => {
    cy.log(Cypress.currentTest.title)
    cy.log('now moving to self exclusion page')
    cy.c_visitResponsive('account/self-exclusion', 'small')
    cy.log('Making sure that Maximum open positions')
    cy.findByText('Maximum open positions').scrollIntoView()

    cy.get('input[name="max_open_bets"]')
      .invoke('val')
      .then((maxBetValue) => cy.log(maxBetValue))

    cy.get('input[name="max_open_bets"]').clear().type(1)
    cy.findByRole('button', { name: 'Next' }).click({ force: true })
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.c_visitResponsive('/', 'small')

    cy.findByTestId('dt_contract_dropdown').should('be.visible')
    cy.findByTestId('dt_contract_dropdown').click()

    cy.get('#dt_contract_multiplier_item > span').should('be.visible')

    cy.log('multiplier option visible')
    cy.get('#dt_contract_multiplier_item > span').click()

    cy.wait(3000)

    cy.contains('.dc-text', 'Up').should('be.visible')
    cy.contains('.dc-text', 'Up').click()

    cy.wait(3000)

    cy.contains('.dc-text', 'Up').should('be.visible')
    cy.contains('.dc-text', 'Up').click()

    cy.findByText(
      'Sorry, you cannot hold more than 1 contracts at a given time. Please wait until some contracts have closed and try again.'
    ).should('be.visible')

    cy.log('Going to validate the number of elements appearing')
    cy.findAllByTestId('dt_positions_toggle').should('be.visible')
    cy.findAllByTestId('dt_positions_toggle').click()

    cy.get('.dc-contract-card-item__footer').should('have.length', 1)
    cy.c_clearTrades()
  })
})
