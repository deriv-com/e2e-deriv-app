import '@testing-library/cypress/add-commands'

function onboardingcfdtrading() {
  //Wallet Onboarding -  tour around CFD section
  cy.get('.wallets-cfd-list-accounts__content')
    .should('exist')
    .then(($mt5list) => {
      const derivedDesc = $mt5list.children().first().text()
      const expectedDesc = 'This account offers CFDs on derived instruments.'
      if (derivedDesc.includes(expectedDesc)) {
        //MT5 Account doesnot exist
        cy.contains('CFDs')
        cy.contains(
          'This is your CFDs trading account. Click Get to create the trading account you desire for trading.'
        )
        cy.findByRole('button', { name: 'Next' }).click()
      } else {
        //MT5 Account exist
        cy.contains('CFDs')
        cy.contains(
          'This is your CFDs trading account. Click Transfer to move funds between your Wallet and trading account.'
        )
        cy.findByRole('button', { name: 'Next' }).click()
      }
    })

  //Wallet Onboarding -  tour around Options and Multiplier section
  cy.get('.wallets-options-and-multipliers-listing__header')
    .should('exist')
    .then(($list) => {
      const derivAppDesc = $list.children().eq(1).text()
      const expderivAppDesc =
        'Get an Options trading account to trade options and multipliers on these apps.'
      if (derivAppDesc.includes(expderivAppDesc)) {
        //Deriv App Trading Account is not created
        cy.contains('Options trading account')
        cy.contains(
          'This is your Options trading account. Click Get to create the Options trading account for trading.'
        )
        cy.findByRole('button', { name: 'Next' }).click()
        cy.contains(
          'Once you have get an Options trading account, choose a Deriv app to trade options or multipliers.'
        )
        cy.findByRole('button', { name: 'Next' }).click()
      } else {
        //Deriv App Trading Account exist
        cy.contains('Options trading account')
        cy.contains(
          'This is your Options trading account balance. Click Transfer to move funds between your Wallet and Options trading account.'
        )
        cy.findByRole('button', { name: 'Next' }).click()
        cy.contains('Choose a Deriv app to trade options or multipliers.')
        cy.findByRole('button', { name: 'Next' }).click()
      }
    })
  // "Add More Wallet section - tour"
  cy.get('.wallets-add-more__carousel')
    .should('exist')
    .then(($list) => {
      const buttontext = $list
        .children()
        .first()
        .find('.wallets-button')
        .first()
        .text()
      const expButtontext = 'Added'
      if (buttontext.includes(expButtontext)) {
        cy.log(`No wallets to add`)
      } else {
        cy.log(`Add more wallets`)
        cy.contains('Click Add on each card for more Wallets.')
        cy.findByRole('button', { name: 'Next' }).click()
      }
    })
  cy.contains('Click here to repeat this tour.')
  cy.findByRole('button', { name: 'Done' }).click()
}

function onboardingfiatwallet() {
  cy.contains('Wallet', { timeout: 10000 }).should('exist')
  cy.findByText('CFDs', { exact: true }).should('be.visible')
  // Onboarding - Account having Fiat wallets (without CFD and Trading account).
  cy.contains('Swap-Free').should('be.visible')
  cy.findByTestId('dt_traders_hub_onboarding_icon').click()
  cy.get('[data-test-id="spotlight"]').should('be.visible')
  onboardingcfdtrading()
}

describe('WALL-3037 & 3039- User Onboarding on Desktop for Fiat Wallets', () => {
  beforeEach(() => {
    cy.c_login({ app: 'wallets', user: 'wallets' })
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to see the tour for Fiat Wallets', () => {
    onboardingfiatwallet()
  })
})
