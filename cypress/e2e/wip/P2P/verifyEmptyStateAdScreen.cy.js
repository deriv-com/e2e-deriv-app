import '@testing-library/cypress/add-commands'

let fixedRate = 1.25
let minOrder = 5
let maxOrder = 10

function verifyAdOnMyAdsScreen(fiatCurrency, localCurrency) {
  cy.findByText('Active').should('be.visible')
  cy.findByText(`Buy ${fiatCurrency}`).should('be.visible')
  cy.findByText(`${fixedRate} ${localCurrency}`)
  cy.findByText(
    `${minOrder.toFixed(2)} - ${maxOrder.toFixed(2)} ${fiatCurrency}`
  )
}

describe('QATEST-2538 Empty State/Buy Sell Page', () => {
  beforeEach(() => {
    cy.c_login({ user: 'p2pVerifyEmptyStateAdScreen' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('Should be able to see an empty state of ads and verify message is displayed.', () => {
    cy.c_navigateToDerivP2P()
    cy.c_closeSafetyInstructions()
    cy.findByText('Deriv P2P').should('exist')
    cy.c_closeNotificationHeader()
    cy.c_checkForEmptyAdScreenMessage('Buy', 'Sell')
    cy.c_checkForEmptyAdScreenMessage('Sell', 'Buy')
    cy.c_checkForExistingAds().then((adExists) => {
      if (adExists == false) {
        cy.findByText('My ads').should('be.visible').click()
        cy.findByRole('button', { name: 'Create new ad' })
          .should('be.visible')
          .click()
        cy.c_createNewAd('buy')
        cy.c_inputAdDetails(fixedRate, minOrder, maxOrder, 'Buy', 'fixed')
      }
      cy.findByText('Buy / Sell').should('be.visible').click()
      cy.c_rateLimit({
        waitTimeAfterError: 15000,
        isLanguageTest: true,
        maxRetries: 5,
      })
      cy.c_checkForNonEmptyStateAdScreen()
      cy.findByText('My ads').should('be.visible').click()
      cy.c_createNewAd('sell')
      cy.c_inputAdDetails(fixedRate, minOrder, maxOrder, 'Sell', 'fixed')
      cy.findByText('Buy / Sell').should('be.visible').click()
      cy.c_rateLimit({
        waitTimeAfterError: 15000,
        isLanguageTest: true,
        maxRetries: 5,
      })
      cy.c_checkForNonEmptyStateAdScreen()
      cy.findByText('My ads').should('be.visible').click()
      cy.c_removeExistingAds('sell')
      cy.findByText('Buy / Sell').should('be.visible').click()
      cy.c_checkForEmptyAdScreenMessage('Buy', 'Sell')
      cy.c_checkForEmptyAdScreenMessage('Sell', 'Buy')
    })
  })
})
