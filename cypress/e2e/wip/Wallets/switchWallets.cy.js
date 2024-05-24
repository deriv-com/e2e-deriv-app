import '@testing-library/cypress/add-commands'
function switchWallets() {
  const performActionsOnElement = (currentIndex, totalElements) => {
    if (currentIndex >= totalElements) {
      return;
    }
      cy.get('.wallets-progress-bar')
      .find('.wallets-progress-bar-active.wallets-progress-bar-transition, .wallets-progress-bar-inactive.wallets-progress-bar-transition')
      .eq(currentIndex)
      .click()
      .then(() => {
        cy.get('.wallets-card__carousel-content-details')
        .eq(currentIndex)
        .find('.wallets-card__details-bottom').invoke('text')
        
        const actions = ['deposit', 'withdraw', 'transfer'];
        let actionChain = Cypress.Promise.resolve();
        actions.forEach((action) => {
          actionChain = actionChain
            .then(() => {
              return cy.get('.wallets-mobile-actions__container')
              .scrollIntoView() // Scroll the container into view
              .find('.wallets-mobile-actions')
                .find(`button[aria-label="${action}"]`)
                .click({ force: true }); // Click on the action button
            })
            .then(() => {
              return cy.get('.wallets-cashier-header')
                .find('.wallets-cashier-header__close-icon')
                .click(); // Close the modal after the action is clicked
            });
        });

        actionChain.then(() => {
          performActionsOnElement(currentIndex + 1, totalElements);
        });
      });
  };

  cy.get('.wallets-progress-bar-active.wallets-progress-bar-transition, .wallets-progress-bar-inactive.wallets-progress-bar-transition')
    .then(($elements) => {
      performActionsOnElement(0, $elements.length);
    });
}


describe('QATEST-139905 - Mobile wallet card redirection', () => {
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
  })

  it('should be able to switch and open correct deposit, withdraw and transfer in all the available wallets in Responsive', () => {
    cy.c_visitResponsive('/wallets', 'small')
    switchWallets()
  })
})
