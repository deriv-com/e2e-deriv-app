import '@testing-library/cypress/add-commands';
import cyrpto from '/Users/vimalanrajakumar/e2e-deriv-app/cypress/e2e/wip/Crypto/Pageobject/common.js';

Cypress.Commands.add("close_notification_banner", () => {
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
  const validatecyrpto = () => {
    cy.close_notification_banner()
    cyrpto.elements.currency_switcher().should('be.visible').click()
    cyrpto.elements.manage_account().should('be.visible').click()
  }
  const validatecyrpto1 = () => {
    cy.close_notification_banner()
    cyrpto.elements.crypto_add_account().should('be.visible').click()
    cyrpto.elements.maybe_later().should('be.visible').click()
    cyrpto.elements.currency_switcher().should('be.visible').click()
  }



  it('should be able to create crypto account from Traders Hub.', () => {
  const cryptocurrencies = ["Bitcoin", "Ethereum", "Litecoin", "Tether TRC20", "USD Coin"];
  cryptocurrencies.forEach(crypto => {
    validatecyrpto()
    cy.findByText(crypto).click();
    validatecyrpto1()
    cy.findByText("0.00000000 BTC").should("be.visible")
  });
  })
})
