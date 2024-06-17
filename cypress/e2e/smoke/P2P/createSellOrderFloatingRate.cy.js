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

describe('TODO', () => {
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
  it('TODO1', () => {
    cy.c_navigateToP2P()
    cy.findByText('My profile').should('be.visible').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    cy.c_getProfileName().then((name) => {
      nicknameAndAmount.buyer = name
    })
    cy.c_getProfileBalance().then((balance) => {
      nicknameAndAmount.buyerBalanceBeforeSelling = balance
    })
    cy.c_clickMyAdTab()
    cy.c_createNewAd('buy')
    cy.c_inputAdDetails(floatRate, minOrder, maxOrder, 'Buy', 'float', 'sell')
  })
  it('TODO2', () => {
    cy.c_navigateToP2P()
    cy.findByText('My profile').should('be.visible').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    cy.c_getProfileName().then((name) => {
      nicknameAndAmount.seller = name
    })
    cy.c_getProfileBalance().then((balance) => {
      nicknameAndAmount.sellerBalanceBeforeBuying = balance
    })
    cy.wait(5000)
    cy.then(() => {
      cy.c_createSellOrder(
        nicknameAndAmount.buyer,
        minOrder,
        maxOrder,
        fiatCurrency,
        pm1,
        sell
      ).then((sendAmount) => {
        nicknameAndAmount.amount = sendAmount
      })
      //TODO
      //   cy.then(() => {
      //     cy.c_verifyOrderPlacementScreen(
      //       nicknameAndAmount.buyer,
      //       sessionStorage.getItem('c_rateOfOneDollar'),
      //       sessionStorage.getItem('c_paymentMethods'),
      //       sessionStorage.getItem('c_sellersInstructions')
      //     )
      //TEMPDODO
      cy.wait(5000)
      cy.then(() => {
        //TODO
        cy.c_waitForPayment(nicknameAndAmount)
        // cy.c_verifyPaymentConfirmationScreenContent(
        //   nicknameAndAmount.amount,
        //   nicknameAndAmount.buyer
        // )
        // cy.findByText('Wait for payment').should('be.visible')
        // cy.findByTestId('testid').should('be.visible').click()
        // cy.findByPlaceholderText('Enter message').should('be.visible')
        // cy.findByText(
        //   "Hello! This is where you can chat with the counterparty to confirm the order details.Note: In case of a dispute, we'll use this chat as a reference."
        // ).should('be.visible')
        // cy.c_uploadPOT('cypress/fixtures/P2P/orderCompletion.png')
        // cy.findByText('Waiting for the seller to confirm').should('be.visible')
        // cy.findByTestId('testid').should('be.visible').click()
        // cy.findByPlaceholderText('Enter message').should('be.visible')
        // cy.findByText(
        //   "Hello! This is where you can chat with the counterparty to confirm the order details.Note: In case of a dispute, we'll use this chat as a reference."
        // ).should('be.visible')
        //TODO
      })
    })
  })
  it('TODO3', () => {
    cy.c_navigateToP2P()
    cy.findByText('Orders').should('be.visible').click()
    cy.c_rateLimit({
      waitTimeAfterError: 15000,
      isLanguageTest: true,
      maxRetries: 5,
    })
    //TODO
    cy.then(() => {
      cy.findByText('Pay now').should('be.visible').click()
      cy.wait(2000) //add proper wait
      cy.findByRole('button', { name: "I've paid" })
        .should('be.visible')
        .click()

      // cy.then(() => {
      //   cy.c_verifyPaymentConfirmationScreenContent(
      //     nicknameAndAmount.amount,
      //     nicknameAndAmount.seller
      //   )
      // })
    })
    // cy.then(() => {
    //     cy.c_verifyOrderPlacementScreen(
    //       nicknameAndAmount.buyer,
    //       sessionStorage.getItem('c_rateOfOneDollar'),
    //       sessionStorage.getItem('c_paymentMethods'),
    //       sessionStorage.getItem('c_sellersInstructions')
    //     )
    //   })
    // cy.findByText(
    //     "Don't risk your funds with cash transactions. Use bank transfers or e-wallets instead."
    //   ).should('be.visible')
    cy.c_uploadPOT('cypress/fixtures/P2P/orderCompletion.png')
    cy.findByText('Waiting for the seller to confirm').should('be.visible')
    cy.findByText(
      "Don't risk your funds with cash transactions. Use bank transfers or e-wallets instead."
    ).should('be.visible')
    // cy.c_confirmSellOrder(nicknameAndAmount)
    // cy.c_giveRating('buyer')
    // cy.findByText('Completed').should('be.visible')
    //TODO
    //TODO balance has not change in this section
    // cy.findByTestId('dt_mobile_full_page_return_icon')
    //   .should('be.visible')
    //   .click()
    // cy.findByText('My profile').should('be.visible').click()
    // cy.findByText('Available Deriv P2P balance').should('be.visible')
    // cy.c_getProfileBalance().then((balance) => {
    //   nicknameAndAmount.buyerBalanceAfterSelling = balance
    // })
    // cy.then(() => {
    //   cy.c_confirmBalance(
    //     nicknameAndAmount.buyerBalanceBeforeSelling,
    //     nicknameAndAmount.buyerBalanceAfterSelling,
    //     maxOrder,
    //     'buyer'
    //   )
    // })
    //TODO balance has not change in this section
  })
  it('TODO4', () => {
    cy.c_navigateToP2P()
    cy.findByText('My profile').should('be.visible').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    cy.c_getProfileBalance().then((balance) => {
      nicknameAndAmount.sellerBalanceAfterBuying = balance
    })
    // cy.then(() => {
    //   cy.c_confirmBalance(
    //     nicknameAndAmount.sellerBalanceBeforeBuying,
    //     nicknameAndAmount.sellerBalanceAfterBuying,
    //     maxOrder,
    //     'seller'
    //   )
    // })
    //TODO
    cy.findByText('Orders').should('be.visible').click()
    cy.c_rateLimit({
      waitTimeAfterError: 15000,
      isLanguageTest: true,
      maxRetries: 5,
    })
    cy.c_confirmSellOrder(nicknameAndAmount, 'sell')
    cy.c_giveRating('buyer')
    cy.findByText('Completed').should('be.visible')
    //TODO The redirection didn't work with back button
    cy.c_navigateToP2P()
    // cy.findByTestId('dt_mobile_full_page_return_icon')
    //   .should('be.visible')
    //   .click()
    // cy.wait(2000)
    //TODO
    cy.findByText('My profile').should('be.visible').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    cy.c_getProfileBalance().then((balance) => {
      nicknameAndAmount.buyerBalanceAfterSelling = balance
    })
    cy.then(() => {
      cy.c_confirmBalance(
        nicknameAndAmount.sellerBalanceBeforeBuying,
        nicknameAndAmount.sellerBalanceAfterBuying,
        maxOrder,
        'seller',
        'sell'
      )
    })
  })
  //TODO
  it('TODO5', () => {
    cy.c_navigateToP2P()
    cy.findByText('My profile').should('be.visible').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    cy.findByText('Orders').should('be.visible').click()
    cy.findByRole('button', { name: 'Past orders' })
      .should('be.visible')
      .click()
    cy.findAllByText('Completed').eq(0).should('be.visible').click()
    //TODO
    cy.findByText('Sell USD order').should('be.visible')
    // cy.findByText('Buy USD order').should('be.visible')
    //TODO
    cy.findByText(nicknameAndAmount.buyer).should('be.visible')
    cy.findByRole('button', { name: 'Rate this transaction' })
      .should('be.visible')
      .click()
    cy.findByText('How would you rate this transaction?').should('be.visible')
    cy.c_giveRating('seller')
  })
})
