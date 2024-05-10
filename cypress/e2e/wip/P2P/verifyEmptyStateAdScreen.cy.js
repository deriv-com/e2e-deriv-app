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
        cy.findByText('Buy USD').click()
        cy.findByText("You're creating an ad to buy...").should('be.visible')
        cy.findByTestId('offer_amount')
          .next('span.dc-text')
          .invoke('text')
          .then((fiatCurrency) => {
            sessionStorage.setItem('c_fiatCurrency', fiatCurrency.trim())
          })
        cy.findByTestId('fixed_rate_type')
          .next('span.dc-text')
          .invoke('text')
          .then((localCurrency) => {
            sessionStorage.setItem('c_localCurrency', localCurrency.trim())
          })
        cy.then(() => {
          cy.findByTestId('offer_amount').type('10').should('have.value', '10')
          cy.findByTestId('fixed_rate_type')
            .type(fixedRate)
            .should('have.value', fixedRate)
          cy.findByTestId('min_transaction')
            .type(minOrder)
            .should('have.value', minOrder)
          cy.findByTestId('max_transaction')
            .type(maxOrder)
            .should('have.value', maxOrder)
          cy.findByTestId('default_advert_description')
            .type('Description Block')
            .should('have.value', 'Description Block')
          cy.findByTestId('dt_dropdown_display').click()
          cy.get('#900').should('be.visible').click()
          cy.c_PaymentMethod()
          cy.c_verifyPostAd()
          verifyAdOnMyAdsScreen(
            sessionStorage.getItem('c_fiatCurrency'),
            sessionStorage.getItem('c_localCurrency')
          )
        })
      }
      cy.findByText('Buy / Sell').should('be.visible').click()
      cy.c_rateLimit({
        waitTimeAfterError: 15000,
        isLanguageTest: true,
        maxRetries: 5,
      })
      cy.c_checkForExistingAds().then((adExists) => {
        if (adExists == true) {
          cy.log('Value is: ' + adExists)
          cy.findByText('My ads').should('be.visible').click()
          cy.findByText('You have no ads 😞').should('not.be.visible')
          cy.c_removeExistingAds()
        } else if (adExists == false) {
          throw new Error('Ad created is not listed')
        }
      })
      cy.c_checkForEmptyAdScreenMessage('Buy', 'Sell')
      cy.c_checkForEmptyAdScreenMessage('Sell', 'Buy')
    })
  })
})
