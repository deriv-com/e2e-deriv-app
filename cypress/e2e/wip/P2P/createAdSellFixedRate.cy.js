import '@testing-library/cypress/add-commands'
import { generateAccountNumberString } from '../../../support/helper/utility'

let fixedRate = 1.25
let minOrder = 5
let maxOrder = 10
let paymentName = 'Alipay'
let paymentID = generateAccountNumberString(12)

function verifyAdOnMyAdsScreen(adType, fiatCurrency, localCurrency) {
  cy.findByText('Active').should('be.visible')
  cy.findByText(`${adType} ${fiatCurrency}`).should('be.visible')
  cy.findByText(`${fixedRate} ${localCurrency}`)
  cy.findByText(
    `${minOrder.toFixed(2)} - ${maxOrder.toFixed(2)} ${fiatCurrency}`
  )
}
describe('QATEST-2425 - Create a Sell type Advert - Fixed Rate', () => {
  beforeEach(() => {
    cy.clearAllSessionStorage()
    cy.c_login({ user: 'p2pFixedRate' })
    cy.c_visitResponsive('/cashier/p2p', 'small')
  })
  it('Should be able to create sell type advert and verify all fields and messages for fixed rate.', () => {
    cy.c_closeSafetyInstructions()
    cy.findByText('Deriv P2P').should('exist')
    cy.c_closeNotificationHeader()
    cy.c_clickMyAdTab()
    cy.c_createNewAd('sell')
    cy.findByText('Sell USD').click()
    cy.findByText("You're creating an ad to sell...").should('be.visible')
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
      cy.c_verifyAmountFiled()
      cy.c_verifyFixedRate(
        'sell',
        10,
        fixedRate,
        sessionStorage.getItem('c_fiatCurrency'),
        sessionStorage.getItem('c_localCurrency')
      )
      cy.c_verifyMaxMin('min_transaction', minOrder, 'Min')
      cy.c_verifyMaxMin('max_transaction', maxOrder, 'Max')
      cy.c_verifyTextAreaBlock('contact_info')
      cy.c_verifyTextAreaBlock('default_advert_description')
      cy.c_verifyTooltip()
      cy.c_verifyCompletionOrderDropdown()
      cy.findByTestId('dt_payment_method_card_add_icon')
        .should('be.visible')
        .click()
      cy.c_addPaymentMethod(paymentID, paymentName)
      cy.findByText(paymentID)
        .should('exist')
        .parent()
        .prev()
        .find('.dc-checkbox')
        .and('exist')
        .click()
      cy.c_verifyPostAd()
      verifyAdOnMyAdsScreen(
        'Sell',
        sessionStorage.getItem('c_fiatCurrency'),
        sessionStorage.getItem('c_localCurrency')
      )
    })
  })
})
