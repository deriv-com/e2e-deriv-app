import '@testing-library/cypress/add-commands'
import { generateAccountNumberString } from '../../../support/helper/utility'

let fixedRate = 1.25
let minOrder = 1
let maxOrder = 10
let paymentName = 'Alipay'
let nickname = {
  buyer: '',
  seller: '',
}
let paymentID = generateAccountNumberString(12)
let fiatCurrency = 'USD'
let localCurrency = 'MNT'

function verifyAdOnMyAdsScreen(adType, fiatCurrency, localCurrency) {
  cy.findByText('Active').should('be.visible')
  cy.findByText(`${adType} ${fiatCurrency}`).should('be.visible')
  cy.findByText(`${fixedRate} ${localCurrency}`)
  cy.findByText(
    `${minOrder.toFixed(2)} - ${maxOrder.toFixed(2)} ${fiatCurrency}`
  )
}

function verifyOrderPlacementScreen() {
  cy.findByText(nickname.seller).should('be.visible')
  cy.findByText(sessionStorage.getItem('c_rateOfOneDollar')).should(
    'be.visible'
  )
  cy.findByText(sessionStorage.getItem('c_paymentMethods')).should('be.visible')
  cy.findByText(sessionStorage.getItem('c_sellersInstructions')).should(
    'be.visible'
  )
  cy.findByRole('button', { name: 'Expand all' }).click()
  cy.findByRole('button', { name: 'Collapse all' }).click()
  cy.findByRole('button', { name: 'Cancel order' }).should('be.enabled')
  cy.findByRole('button', { name: "I've paid" })
    .should('not.be.disabled')
    .click()
}

function verifyPaymentConfirmationScreenContent() {
  cy.findByText('Payment confirmation')
  cy.findByText(
    `Please make sure that you\'ve paid ${(parseFloat(fixedRate) * parseFloat(maxOrder)).toFixed(2)} ${localCurrency} to ${nickname.seller}, and upload the receipt as proof of your payment`
  )
  cy.findByText(
    'Sending forged documents will result in an immediate and permanent ban.'
  )
  cy.findByText('We accept JPG, PDF, or PNG (up to 5MB).')
}

// function logoutAccount() {
//   cy.findByTestId('dt_acc_info').should('be.visible').click()
//   cy.findByText('Log out').click()
//   cy.findByText('Log in to continue.')
// }

// function loginAccount() {
//   cy.get('#txtEmail').type(Cypress.env('credentials').test.p2pFixedRate3.ID)
//   cy.get('#txtPass').type(Cypress.env('credentials').test.p2pFixedRate3.PSWD)
//   //cy.findByRole('input', { name: 'email' }).type(Cypress.env('credentials').test.p2pFixedRate3.ID)
//   //cy.findByRole('input', { name: 'password' }).type(Cypress.env('credentials').test.p2pFixedRate3.PSWD)
//   cy.findByRole('button', { name: 'Log in' }).click()
// }

function c_verifyBuyOrderField(minOrder, maxOrder) {
  cy.get('input[name="amount"]').clear().type('abc').should('have.value', '')
  cy.findByText('Enter a valid amount').should('be.visible')
  cy.get('input[name="amount"]').clear().type('5abc').should('have.value', '5')
  cy.get('input[name="amount"]').clear().type('!@#').should('have.value', '')
  cy.findByText('Enter a valid amount').should('be.visible')
  cy.get('input[name="amount"]')
    .clear()
    .type(maxOrder + 1)
    .should('have.value', maxOrder + 1)
  cy.findByText(`Maximum is ${maxOrder.toFixed(2)} ${fiatCurrency}`).should(
    'be.visible'
  )
  cy.get('input[name="amount"]')
    .clear()
    .type(minOrder - 0.5)
    .should('have.value', minOrder - 0.5)
  cy.findByText(`Minimum is ${minOrder.toFixed(2)} ${fiatCurrency}`).should(
    'be.visible'
  )
  cy.get('input[name="amount"]')
    .clear()
    .type(maxOrder)
    .should('have.value', maxOrder)
}

let isSellAdUser = true
const loginWithNewUser = (userAccount, isSellAdUserAccount) => {
  Cypress.prevAppId = 0
  cy.c_login({ user: userAccount, rateLimitCheck: true })
  isSellAdUser = isSellAdUserAccount
}

describe('QATEST-2425 - Create a Sell type Advert - Fixed Rate', () => {
  before(() => {
    cy.clearAllSessionStorage()
  })
  beforeEach(() => {
    if (expect.getState().currentTestIndex !== 4) {
      if (isSellAdUser == true) {
        loginWithNewUser('p2pFloatingSellAd1', false)
      } else {
        loginWithNewUser('p2pFloatingSellAd2', true)
      }
      cy.c_visitResponsive('/appstore/traders-hub', 'small'),
        {
          rateLimitCheck: true,
        }
    }
  })
  it('Should be able to create sell type advert and verify all fields and messages for fixed rate.', () => {
    cy.log("Seller's account")
    cy.c_navigateToDerivP2P()
    cy.c_closeSafetyInstructions()
    cy.findByText('Deriv P2P').should('exist')
    cy.c_closeNotificationHeader()
    cy.findByText('My profile').should('be.visible').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    cy.get('.my-profile-name__column')
      .children('.dc-text')
      .invoke('text')
      .then((sellerName) => {
        nickname.seller = sellerName
      })
    cy.log(nickname.seller)
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
      cy.findByTestId('contact_info')
        .clear()
        .type('Contact Info Block.')
        .should('have.value', 'Contact Info Block.')
      cy.findByTestId('default_advert_description')
        .clear()
        .type('Instructions Block.')
        .should('have.value', 'Instructions Block.')
      cy.findByTestId('dt_dropdown_display').click()
      cy.get('#900').should('be.visible').click()
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
  it('Should be able to place an order for buy advert verify all fields and messages for fixed rate.', () => {
    cy.log(nickname.seller)
    cy.c_navigateToDerivP2P()
    cy.c_closeSafetyInstructions()
    cy.findByText('Deriv P2P').should('exist')
    cy.c_closeNotificationHeader()
    cy.findByText('My profile').should('be.visible').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    cy.get('.my-profile-name__column')
      .children('.dc-text')
      .invoke('text')
      .then((buyerName) => {
        nickname.buyer = buyerName
      })
    cy.then(() => {
      cy.findByText('Buy / Sell').should('be.visible').click()
      cy.findByPlaceholderText('Search')
        .should('be.visible')
        .type(nickname.seller)
        .should('have.value', nickname.seller)
      cy.get('.buy-sell-row__advertiser')
        .next('.buy-sell-row__information')
        .find('button[type="submit"]')
        .should('be.visible')
        .click()
      cy.findByRole('button', { name: 'Confirm' }).should('be.visible')
      cy.findByText('Seller').next('p').should('have.text', nickname.seller)
      cy.findByText(
        `Limit: ${minOrder.toFixed(2)}–${maxOrder.toFixed(2)} ${fiatCurrency}`
      ).should('be.visible')
      c_verifyBuyOrderField(minOrder, maxOrder)
      cy.findAllByText('Rate (1 USD)')
        .eq(0)
        .next('p')
        .invoke('text')
        .then((rateOfOneDollar) => {
          sessionStorage.setItem('c_rateOfOneDollar', rateOfOneDollar.trim())
        })
      cy.findByText('Payment methods')
        .next('div')
        .children('p')
        .invoke('text')
        .then((paymentMethods) => {
          sessionStorage.setItem('c_paymentMethods', paymentMethods.trim())
        })
      cy.findByText("Seller's instructions")
        .next('p')
        .invoke('text')
        .then((sellersInstructions) => {
          sessionStorage.setItem(
            'c_sellersInstructions',
            sellersInstructions.trim()
          )
        })
      cy.findByText('Orders must be completed in')
        .next('p')
        .invoke('text')
        .then((orderCompletionTime) => {
          sessionStorage.setItem(
            'c_orderCompletionTime',
            orderCompletionTime.trim()
          )
        })
      cy.then(() => {
        cy.findByRole('button', { name: 'Cancel' }).should('be.enabled')
        cy.findByRole('button', { name: 'Confirm' })
          .should('not.be.disabled')
          .click()
        verifyOrderPlacementScreen()
        verifyPaymentConfirmationScreenContent()
        cy.findByTestId('dt_file_upload_input').selectFile(
          'cypress/fixtures/P2P/orderCompletion.png',
          { force: true }
        )
        cy.findByTestId('dt_remove_file_icon').should('be.visible')
        cy.findByRole('button', { name: 'Go Back' }).should('be.enabled')
        cy.findByRole('button', { name: 'Confirm' })
          .should('be.enabled')
          .click()
        cy.findByText('Waiting for the seller to confirm').should('be.visible')
      })
    })
  })
  it('Should be able to confirm sell order and then logout from session.', () => {
    cy.log("Seller's Account")
    cy.c_navigateToDerivP2P()
    cy.c_rateLimit({
      waitTimeAfterError: 15000,
      isLanguageTest: true,
      maxRetries: 5,
    })
    cy.c_closeSafetyInstructions()
    cy.findByText('Deriv P2P').should('exist')
    cy.c_closeNotificationHeader()
    cy.findByText('Orders').should('be.visible').click()
    cy.findByText('Confirm payment').should('be.visible').click()
    cy.findByText(
      "Don't risk your funds with cash transactions. Use bank transfers or e-wallets instead."
    ).should('be.visible')
    cy.then(() => {
      cy.findByRole('button', { name: "I've received payment" })
        .should('be.enabled')
        .click()
      cy.findByText('Has the buyer paid you?').should('be.visible')
      cy.findByText('I didn’t receive the email').should('be.visible')
      cy.findByTestId('dt_modal_close_icon').should('be.visible').click()
      //logoutAccount()
      cy.c_emailVerification(
        'track_p2p_order_confirm_verify.html',
        Cypress.env('credentials').test.p2pFloatingSellAd1.ID
      )
      cy.then(() => {
        cy.c_visitResponsive(Cypress.env('verificationUrl'), 'small')
      })
      //loginAccount()
      cy.findByText('One last step before we close this order').should(
        'be.visible'
      )
      cy.findByText(
        `If you’ve received ${parseFloat(fixedRate * maxOrder).toFixed(2)} ${localCurrency} from ${nickname.seller} in your bank account or e-wallet, hit the button below to complete the order.`
      ).should('be.visible')
      cy.findByRole('button', { name: 'Confirm' }).should('be.enabled').click()
      cy.findByText('How would you rate this transaction?').should('be.visible')
      cy.findByRole('button', { name: 'Skip' }).should('be.enabled').click()
      cy.findByText('Completed').should('be.visible')
    })
  })
})
