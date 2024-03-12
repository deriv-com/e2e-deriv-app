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
  const validatecrypto = (crypto) => {
    cy.close_notification_banner();
    cyrpto.elements.currency_switcher().should('be.visible').click();
    cyrpto.elements.manage_account().should('be.visible').click();
    cy.findByText(crypto).click();
    cyrpto.elements.crypto_add_account().should('be.visible').click();
    cyrpto.elements.maybe_later().should('be.visible').click();
    return crypto;
  };
  it('should be able to create crypto account from Traders Hub.', () => {
    const cryptocurrencies = ["Bitcoin", "Ethereum", "Litecoin", "Tether TRC20", "USD Coin"];
    cryptocurrencies.forEach(crypto => {
      validatecrypto(crypto);
      // Now you can use `selectedCrypto` in further assertions or operations
      // For example:
      // cy.findByText(selectedCrypto).should('be.visible');
      // cy.get('#modal_root').click();
    });
  });
  })
