import '@testing-library/cypress/add-commands'
import mt5 from '../../../support/mt5Elements';

describe('QATEST-20404 - Create all CR Real Swap-Free MT5 accounts via Traders Hub', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.wait(5000)
  })

  it('Should be able to create real MT5 swap free account.', () => {
    cy.get("body").then(($body) => {
      const tradersHubElement = $body.find('[data-testid="dt_traders_hub"]');
      
      // Existing MT5 Swap-Free account check
      if (tradersHubElement.find(':contains("Swap-FreeSVG")').length > 0) {

        const loginId = tradersHubElement.find('.dc-text.title:contains("Swap-Free")').closest('.trading-app-card__details').find('.dc-text.description').text();
        cy.log(`Existing Real Swap-Free MT5 account with Loginid: ${loginId} found.`);
      }
      // Create a MT5 Swap-Free account
      else {
        cy.log('Creating Real Swap-Free MT5 account');
       
        
        mt5.elements.mt5SwapFreeTxt().scrollIntoView().should('be.visible');
        mt5.elements.mt5GetBtn().should('be.visible').click();
        mt5.elements.svgJurModal().should('be.visible').click();
        mt5.elements.swapFootNote().should('be.visible');
        mt5.elements.nextBtn().click();
        mt5.elements.mt5PassInput().click().type(Cypress.env('mt5Password'));
        mt5.elements.mt5CreateBtn().click();
        mt5.elements.mt5SuccessMsg().should('be.visible');
        mt5.elements.maybeLaterBtn().click();
        mt5.elements.mt5SwapFreeTitle().should('be.visible');
        


      }
    });
  });
});
