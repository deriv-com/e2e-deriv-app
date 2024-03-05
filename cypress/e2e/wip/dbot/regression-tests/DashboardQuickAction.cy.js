import "@testing-library/cypress/add-commands";
import Common from "../pageobjects/common";
import BotDashboard from "../pageobjects/bot_dashboard_page";
import BotBuilder from "../pageobjects/bot_builder_page";
import quickStrategy from "../pageobjects/quick_strategy";

describe("QATEST-4128: Dashboard quick action to Quick Strategy and Bot Builder", () => {
  const common = new Common();
  const botDashboard = new BotDashboard();
  const botBuilder = new BotBuilder();
  
  beforeEach(() => {
    cy.c_login();
    cy.c_visitResponsive("/bot", "large");
    common.skipTour();
    cy.close_notification_banner(); //TODO: Update the naming
  });
  
  it("Go to bot builder page", () => {
    botDashboard.openBotBuilderQaction();
    common.skipTour();
    botDashboard.botBuilderActiveTab.should('exist');
  });
  
  it("Open quick strategy modal", () => {
    botDashboard.openQsQaction();
    botDashboard.botBuilderActiveTab.should('exist');
    quickStrategy.quickStrategyMarketDropdown.should("be.visible");
  });
});