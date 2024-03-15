import "@testing-library/cypress/add-commands"
import mt5 from "../../PageElements/mt5Element";

function loading_check() {
    cy.findByTestId("dt_div_100_vh")
      .findByTestId("dt_popover_wrapper")
      .findByTestId("dt_balance_text_container")
      .should("be.visible", {
        timeout: 30000,
      });
  }

  function check_market_type(marketType) {
    cy.get("body").then(() => {
      cy.contains('.trading-app-card__container', marketType)
        .parent() // Move up to the common parent
        .find('.trading-app-card__actions')
        .then(($actions) => {
          if ($actions.find('button[name="transfer-btn"]').length > 0) {
            cy.log(`Existing Real ${marketType} MT5 account found will proceed to reset password`);
            reset_password ()
            
          } else {
            cy.log(`Creating ${marketType} MT5 account`);
          }
        });
    });
  }

  function reset_password () {
    const verification_url = Cypress.env("verificationdUrl")  
    let verification_code = Cypress.env("walletsWithdrawalCode")
    mt5.elements.mt5DerivedTxt().scrollIntoView().should('be.visible')
    mt5.elements.mt5DerivedOpenBtn().should('be.visible').click()
    cy.findByText('Derived SVG').should('be.visible')
    mt5.elements.mt5ResetPassword().click();
    cy.findByText('Use this password to log in to your Deriv MT5 accounts on the desktop, web, and mobile apps.').should('be.visible')
    mt5.elements.mt5ChangePassword().should('be.visible').click()
    cy.findByText('This will change the password to all of your Deriv MT5 accounts.').should('be.visible')
    mt5.elements.mt5ConfirmChangePassword().click()

    cy.c_emailVerificationMT5(verification_code, Cypress.env("mainQaBoxBaseUrl"))
    cy.then(() => {
      Cypress.config("baseUrl")
      cy.c_visitResponsive(
        `${verification_url }`,
        "large"
      )})
      cy.get('div').contains('Create a new Deriv MT5 Password').should("be.visible")
      cy.findByPlaceholderText('Deriv MT5 password').click().type(Cypress.env('mt5Password'))
      cy.findByRole('button', { name: 'Create' }).click()
  }

describe("QATEST-37180 - Reset Password", () => {
  beforeEach(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'large')
    })
    
    it('MT5 reset password',() => {
      loading_check();
      check_market_type('Derived')

    })


})



    // cy.get("body").then(() => {
    //   cy.contains('.trading-app-card__container', 'Financial')
    //     .parent() // Move up to the common parent
    //     .find('.trading-app-card__actions')
    //     .then(($actions) => {
    //       if ($actions.find('button[name="transfer-btn"]').length > 0) {
    //           loading_check();
    //           cy.log(`Existing Real Swap-Free MT5 account with Loginid: found will proceed to reset password`);
    //       } else {
    //         cy.log('Creating Derived SVG MT5 account');
    //       }
    //     });
    // });    



              // const loginId = tradersHubElement.find('.dc-text.title:contains("Swap-Free")').next('.dc-text.trading-app-card__details__short-code:contains("SVG")').closest('.trading-app-card__details').find('.dc-text.description').text();
