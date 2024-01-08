import tradersHub from "../pageobjects/traders_hub";
import common from "../pageobjects/common";
import botDashboard from "../pageobjects/bot_dashboard_page";
import botBuilder from "../pageobjects/bot_builder_page";


describe("Verify toolbar on bot builder page", () => {
  let userName = Cypress.env("username_cr_unauthenticated");
  let strategyName = "Stock_Netherland_25"+(Math.random()).toString();

  beforeEach(() => {
    cy.login_setup(userName);
    tradersHub.openBotButton.click();
    common.skipTour();
    common.switchToDemo();
    botBuilder.openBotBuilderTab();
    common.skipTour();
  });

  it("Save a strategy to local", () => {
    botBuilder.changeMarketOnBlocklyWorkspace(1, "Stock Indices");
    botBuilder.changeMarketOnBlocklyWorkspace(2, "European indices");
    botBuilder.changeMarketOnBlocklyWorkspace(3, "Netherlands 25");
    botBuilder.saveStrategyFromToolbar(strategyName);
    cy.wait(5000);
    botDashboard.goToDashboard();
    botDashboard.strategySaveStatus(strategyName).should('have.text', 'Local');

  });

  it("Import strategy from local", () => {
    botBuilder.importStrategyFromToolbar('Martingale Old');
    common.snackBar.should('have.text', 'You’ve successfully imported a bot.');
  });
 
});
