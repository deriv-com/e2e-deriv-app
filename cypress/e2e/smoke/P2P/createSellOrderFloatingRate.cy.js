let floatRate = 0.01
let minOrder = 1
let maxOrder = 10
const pm1 = 'Bank Transfer'
let nicknameAndAmount = {
  sellerBalanceBeforeSelling: '',
  sellerBalanceAfterSelling: '',
  buyerBalanceBeforeBuying: '',
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

function getProfileData(userType, balanceType) {
  cy.findByText('My profile').should('be.visible').click()
  cy.findByText('Available Deriv P2P balance').should('be.visible')

  cy.c_getProfileName().then((name) => {
    if (userType) {
      nicknameAndAmount[userType] = name
    }
  })

  cy.c_getProfileBalance().then((balance) => {
    nicknameAndAmount[balanceType] = balance
  })
}

describe('QATEST-50478 - Place a Sell Order same currency ads - floating rate ads ', () => {
  before(() => {
    cy.clearAllSessionStorage()
  })
  beforeEach(() => {
    if (isSellAdUser == true) {
      loginWithNewUser('p2pFloatingSellOrder1', false)
    } else {
      loginWithNewUser('p2pFloatingSellOrder2', true)
    }
    cy.c_visitResponsive('/appstore/traders-hub', 'small'),
      {
        rateLimitCheck: true,
      }
  })
  it('Should be able to create a Buy type advert', () => {
    cy.c_navigateToP2P()
    getProfileData('buyer', 'buyerBalanceBeforeBuying')
    cy.c_clickMyAdTab()
    cy.c_createNewAd('buy')
    cy.c_inputAdDetails(floatRate, minOrder, maxOrder, 'Buy', 'float', {
      paymentMethod: 'Bank Transfer',
    })
  })
  it('Should be able to create a Sell order', () => {
    cy.c_navigateToP2P()
    getProfileData('seller', 'sellerBalanceBeforeSelling')
    cy.wait(2000) // Give buffer before creating order
    cy.then(() => {
      cy.c_createSellOrder(
        nicknameAndAmount.buyer,
        minOrder,
        maxOrder,
        fiatCurrency,
        pm1,
        'sell',
        'float'
      )
    })
    cy.c_waitForPayment()
  })
  it("Buyer should be able to click on I've Paid and provide the POT attachment", () => {
    cy.c_navigateToP2P()
    cy.findByText('Orders').should('be.visible').click()
    cy.c_rateLimit({
      waitTimeAfterError: 15000,
      isLanguageTest: true,
      maxRetries: 5,
    })
    cy.then(() => {
      cy.findByText('Pay now').should('be.visible').click()
      cy.wait(2000) // verify "I've paid" button in the page
      cy.findByRole('button', { name: "I've paid" }).should('be.visible')
      cy.findByText('Send')
        .next('span')
        .invoke('text')
        .then((sendAmount) => {
          nicknameAndAmount.amount = sendAmount.trim()
        })
        .then(() => {
          cy.findByRole('button', { name: "I've paid" }).click()
          cy.c_uploadPOT('cypress/fixtures/P2P/orderCompletion.png')
          cy.findByText('Waiting for the seller to confirm').should(
            'be.visible'
          )
          cy.findByText(
            "Don't risk your funds with cash transactions. Use bank transfers or e-wallets instead."
          ).should('be.visible')
        })
    })
  })
  it("Seller should be able to see I've Received Button and confirm the payment", () => {
    cy.c_navigateToP2P()
    cy.findByText('Orders').should('be.visible').click()
    cy.c_rateLimit({
      waitTimeAfterError: 15000,
      isLanguageTest: true,
      maxRetries: 5,
    })
    cy.c_confirmOrder(nicknameAndAmount, 'sell')
    cy.c_giveRating('buyer')
    cy.findByText('Completed').should('be.visible')
    cy.c_navigateToP2P()
    getProfileData(null, 'sellerBalanceAfterSelling')
    cy.then(() => {
      cy.c_confirmBalance(
        nicknameAndAmount.sellerBalanceBeforeSelling,
        nicknameAndAmount.sellerBalanceAfterSelling,
        minOrder,
        'seller',
        'sell'
      )
    })
  })
  it('Should be able to verify completed order for buyer', () => {
    cy.c_navigateToP2P()
    getProfileData(null, 'buyerBalanceAfterBuying')
    cy.then(() => {
      cy.c_confirmBalance(
        nicknameAndAmount.buyerBalanceBeforeBuying,
        nicknameAndAmount.buyerBalanceAfterBuying,
        minOrder,
        'buyer',
        'sell'
      )
    })
    cy.findByText('Orders').should('be.visible').click()
    cy.findByRole('button', { name: 'Past orders' })
      .should('be.visible')
      .click()
    cy.findAllByText('Completed').eq(0).should('be.visible').click()
    cy.findByText('Buy USD order').should('be.visible')
    cy.findByText(nicknameAndAmount.seller).should('be.visible')
    cy.findByRole('button', { name: 'Rate this transaction' })
      .should('be.visible')
      .click()
    cy.findByText('How would you rate this transaction?').should('be.visible')
    cy.c_giveRating('seller')
  })
})
