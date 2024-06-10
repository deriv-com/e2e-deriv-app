import '@testing-library/cypress/add-commands'

let floatRate = 1.25
let minOrder = 1
let maxOrder = 10
let nicknameAndAmount = {
  sellerBalanceBeforeSelling: '',
  sellerBalanceAfterSelling: '',
  buyerBalanceBeforeBuying: '9750',
  buyerBalanceAfterBuying: '',
  buyer: '',
  seller: '',
  amount: '',
}
let fiatCurrency = 'USD'

let isSellAdUser = true
const loginWithNewUser = (userAccount, isSellAdUserAccount) => {
  Cypress.prevAppId = 0
  cy.c_login({ user: userAccount, rateLimitCheck: true })
  isSellAdUser = isSellAdUserAccount
}

describe('QATEST-50478, QATEST-2709, QATEST-2542, QATEST-2769, QATEST-2610  - Advertise floating-type sell ad, search for advertiser and place buy order with same currency, confirm order with 2FA and give rating recommendation for both buyer and seller', () => {
  before(() => {
    cy.clearAllSessionStorage()
  })
  beforeEach(() => {
    if (isSellAdUser == true) {
      loginWithNewUser('p2pFloatingSellAd1', false)
    } else {
      loginWithNewUser('p2pFloatingSellAd2', true)
    }
    cy.c_visitResponsive('/appstore/traders-hub', 'small'),
      {
        rateLimitCheck: true,
      }
  })
  it('Should be able to create sell type advert and verify all fields and messages for floating rate.', () => {
    cy.c_navigateToP2P()
    cy.findByText('My profile').should('be.visible').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    cy.c_getProfileName().then((name) => {
      nicknameAndAmount.seller = name
    })
    cy.c_getProfileBalance().then((balance) => {
      nicknameAndAmount.sellerBalanceBeforeSelling = balance
    })
    cy.c_clickMyAdTab()
    cy.c_createNewAd('buy')
    cy.c_inputAdDetails(floatRate, minOrder, maxOrder, 'Buy', 'float')
  })

  it('Should be able to place an order for advert and verify all fields and messages for floating rate.', () => {
    cy.c_navigateToP2P()
    cy.findByText('My profile').should('be.visible').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    cy.c_getProfileName().then((name) => {
      nicknameAndAmount.buyer = name
    })
    cy.c_getProfileBalance().then((balance) => {
      nicknameAndAmount.buyerBalanceBeforeBuying = balance
    })
    cy.then(() => {
      cy.c_createSellOrder(
        nicknameAndAmount.seller,
        minOrder,
        maxOrder,
        fiatCurrency
      ).then((sendAmount) => {
        nicknameAndAmount.amount = sendAmount
      })
      cy.c_waitForPayment(nicknameAndAmount)
    })
  })

  it("Should be able to confirm sell order from verification link, give rating to buyer and then confirm seller's balance.", () => {
    cy.c_navigateToP2P()
    cy.findByText('Orders').should('be.visible').click()
    cy.c_rateLimit({
      waitTimeAfterError: 15000,
      isLanguageTest: true,
      maxRetries: 5,
    })
    cy.then(() => {
      cy.findByText('Pay now').should('be.visible').click()
      cy.wait(2000) //add proper wait
      cy.c_verifyOrderPlacementScreenSell(
        nicknameAndAmount.buyer
        // sessionStorage.getItem('c_rateOfOneDollar'),
        // sessionStorage.getItem('c_paymentMethods'),
        // sessionStorage.getItem('c_sellersInstructions')
      )
    })
    cy.then(() => {
      cy.c_verifyPaymentConfirmationScreenContent(
        nicknameAndAmount.amount,
        nicknameAndAmount.buyer
      )
      cy.c_uploadPOT('cypress/fixtures/P2P/orderCompletion.png')
      cy.findByText('Waiting for the seller to confirm').should('be.visible')
      cy.findByTestId('testid').should('be.visible').click()
      cy.findByPlaceholderText('Enter message').should('be.visible')
      cy.findByText(
        "Hello! This is where you can chat with the counterparty to confirm the order details.Note: In case of a dispute, we'll use this chat as a reference."
      ).should('be.visible')
    })
    cy.c_navigateToP2P()
    cy.findByText('Orders').should('be.visible').click()
    cy.c_rateLimit({
      waitTimeAfterError: 15000,
      isLanguageTest: true,
      maxRetries: 5,
    })
    cy.findByText('Waiting for the seller to confirm').should('be.visible')
  })
  it('1', () => {
    cy.c_navigateToP2P()
    cy.findByText('Orders').should('be.visible').click()
    cy.c_rateLimit({
      waitTimeAfterError: 15000,
      isLanguageTest: true,
      maxRetries: 5,
    })
    cy.findByText('Confirm payment').should('be.visible').click()
    cy.log('nicknameAndAmount')
    cy.c_confirmSellOrder(nicknameAndAmount)
    // cy.c_confirmSellOrder(nicknameAndAmount)
    cy.c_giveRating('buyer')
    cy.findByText('Completed').should('be.visible')
    cy.findByTestId('dt_mobile_full_page_return_icon')
      .should('be.visible')
      .click()
    cy.findByText('My profile').should('be.visible').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    cy.c_getProfileBalance().then((balance) => {
      nicknameAndAmount.buyerBalanceAfterSelling = balance
      //   nicknameAndAmount.sellerBalanceAfterSelling = balance
    })
    cy.then(() => {
      cy.c_confirmBalance(
        nicknameAndAmount.sellerBalanceBeforeSelling,
        nicknameAndAmount.sellerBalanceAfterSelling,
        maxOrder,
        'buyer'
      )
    })
  })
})
