import '@testing-library/cypress/add-commands'
import cryptoconfig from '/Users/vimalanrajakumar/e2e-deriv-app/cypress/e2e/wip/Crypto/Pageobject/common.js'

const addcryptoaccount = (crypto, code) => {
  cy.c_closeNotificationHeader()
  cryptoconfig.elements.currencyswitcher().should('be.visible').click()
  cryptoconfig.elements.manageaccount().should('be.visible').click()
  cy.get('.add-crypto-currency').then(($parent) => {
    const $input = $parent.find(`input[name="currency"][id="${code}"][disabled]`)
    if ($input.length > 0) {
      // Element is disabled
      cy.log(`${code} input element is disabled.`)
      cy.get('.dc-modal-header__close').click()
      cy.c_closeNotificationHeader()
    } else {
      // Element is not disabled
      cy.c_closeNotificationHeader()
      cy.findByText(crypto).click()
      cryptoconfig.elements.cryptoaddaccount().should('be.visible').click()
      cy.findByText('Success!')
      cy.findByText('Make a deposit now to start trading.')
      cryptoconfig.elements.maybelater().should('be.visible').click()
    }})
  return crypto
};

describe('QATEST-707 - Create crypto account', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })
  it('should be able to create crypto account from Traders Hub.', () => {
    const cryptocurrencies = ["Bitcoin", "Ethereum", "Litecoin", "Tether TRC20", "USD Coin"]
    const currency_code = ["BTC", "ETH", "LTC", "tUSDT", "USDC"]
    // loop to make sure it check for all available currency
    cryptocurrencies.forEach((crypto, index) => {
        const code = currency_code[index]
        addcryptoaccount(crypto, code)
    });
    // to check for the account balance after creation
      cryptoconfig.elements.currencyswitcher().should('be.visible').click();
      cy.findByText("0.00000000 BTC").should("be.visible")
      cy.findByText("0.00000000 ETH").should("be.visible")
      cy.findByText("0.00000000 LTC").should("be.visible")
      cy.findByText("0.00 tUSDT").should("be.visible")
      cy.findByText("0.00 USDC").should("be.visible") 
});
  })