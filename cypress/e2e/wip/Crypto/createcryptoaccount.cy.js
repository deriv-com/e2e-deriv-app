import '@testing-library/cypress/add-commands';
import cyrpto from '/Users/vimalanrajakumar/e2e-deriv-app/cypress/e2e/wip/Crypto/Pageobject/common.js';

Cypress.Commands.add("closenotificationbanner", () => {
  cy.get('body').then(($body) => {
    if ($body.find('.notification--warning').length) {
      cy.get('.notification--warning')
        .should('exist')
        .each(($element) => {
          cy.wrap($element).find('.notification__close-button').should('be.visible').click({ force: true });
        });
    }
  });
});

describe('QATEST-707 - Create crypto account', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })
  const addcryptoaccount = (crypto) => {
    cyrpto.elements.currencyswitcher().should('be.visible').click();
    cyrpto.elements.manageaccount().should('be.visible').click();
    cy.findByText(crypto).click();
    cyrpto.elements.cryptoaddaccount().should('be.visible').click();
    cy.findByText('Success!')
    cy.findByText('Make a deposit now to start trading.')
    cyrpto.elements.maybelater().should('be.visible').click();
    cy.closenotificationbanner();
    return crypto;
  };
  const checkaccountbalance = () => {
    cyrpto.elements.currencyswitcher().should('be.visible').click();
  };
  it('should be able to create crypto account from Traders Hub.', () => {
    cy.wait(1000).closenotificationbanner();
    const cryptocurrencies = ["Bitcoin", "Ethereum", "Litecoin", "Tether TRC20", "USD Coin"];
    cryptocurrencies.forEach(crypto => {
      addcryptoaccount(crypto);
 });
      checkaccountbalance();
      cy.findByText("0.00000000 BTC").should("be.visible")
      cy.findByText("0.00000000 ETH").should("be.visible")
      cy.findByText("0.00000000 LTC").should("be.visible")
      cy.findByText("0.00 tUSDT").should("be.visible")
      cy.findByText("0.00 USDC").should("be.visible") 
});
  })
