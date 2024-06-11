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
let testPassed = false

let isSellAdUser = true
const loginWithNewUser = (userAccount, isSellAdUserAccount) => {
  Cypress.prevAppId = 0
  cy.c_login({ user: userAccount, rateLimitCheck: true })
  isSellAdUser = isSellAdUserAccount
}

describe('test', () => {
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
    testPassed = false
    cy.c_navigateToP2P()
    cy.log('p2pFloatingSellAd2')
    cy.findByText('My profile').should('be.visible').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    cy.c_getProfileName().then((name) => {
      nicknameAndAmount.seller = name
    })
    cy.c_getProfileBalance().then((balance) => {
      nicknameAndAmount.sellerBalanceBeforeSelling = balance
    })
    cy.c_clickMyAdTab()
    // delete old payment method from my profile
    cy.c_createNewAd('buy')
    cy.c_inputAdDetails(floatRate, minOrder, maxOrder, 'Buy', 'float')
    testPassed = true
  })

  it('Should be able to place an order for advert and verify all fields and messages for floating rate.', () => {
    if (!testPassed) {
      this.skip()
    }
    testPassed = false
    cy.c_navigateToP2P()
    cy.log('p2pFloatingSellAd1')
    cy.findByText('My profile').should('be.visible').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    // cy.c_getProfileName().then((name) => {
    //   nicknameAndAmount.buyer = name
    // })
    // cy.c_getProfileBalance().then((balance) => {
    //   nicknameAndAmount.buyerBalanceBeforeBuying = balance
    // })
    cy.then(() => {
      // select payment method for new order
      cy.c_createSellOrder(
        nicknameAndAmount.seller,
        minOrder,
        maxOrder,
        fiatCurrency
      )
      // ).then((sendAmount) => {
      //   nicknameAndAmount.amount = sendAmount
      // })
      cy.c_waitForPayment(nicknameAndAmount)
    })
    testPassed = true
  })

  it("Should be able to confirm sell order from verification link, give rating to buyer and then confirm seller's balance.", () => {
    if (!testPassed) {
      this.skip()
    }
    testPassed = false
    cy.c_navigateToP2P()
    cy.log('p2pFloatingSellAd2')
    cy.findByText('Orders').should('be.visible').click()
    cy.c_rateLimit({
      waitTimeAfterError: 15000,
      isLanguageTest: true,
      maxRetries: 5,
    })
    cy.then(() => {
      cy.findByText('Pay now').should('be.visible').click()
      cy.wait(2000) //add proper wait
      cy.findByText("I've paid").should('be.visible').click()
      cy.then(() => {
        cy.c_verifyPaymentConfirmationScreenContent1(
          nicknameAndAmount.amount,
          nicknameAndAmount.seller
        )
      })
      testPassed = false
    })

    it('1', () => {
      if (!testPassed) {
        this.skip()
      }
      cy.c_navigateToP2P()
      cy.findByText('Orders').should('be.visible').click()
      cy.c_rateLimit({
        waitTimeAfterError: 15000,
        isLanguageTest: true,
        maxRetries: 5,
      })
    })
  })
})
