import "@testing-library/cypress/add-commands";
import LoginPage from "../pageobjects/login_page";
import TradersHub from "../pageobjects/traders_hub";
import Common from "../pageobjects/common";
import BotDashboard from "../pageobjects/bot_dashboard_page";
import BotBuilder from "../pageobjects/bot_builder_page";

describe("QATEST-99418: Verify toolbar on bot builder page", () => {
  const tradersHub = new TradersHub();
  const common = new Common();
  const botDashboard = new BotDashboard();
  const botBuilder = new BotBuilder();
  let strategyName = "Stock_Netherland_25" + Math.random().toString();

  beforeEach(() => {
    cy.c_login();
    cy.c_visitResponsive("/appstore/traders-hub", "large");
    tradersHub.openBotButton.click();
    cy.wait(4000);
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
    botDashboard.strategySaveStatus(strategyName).should("have.text", "Local");
  });

  it("Import strategy from local", () => {
    botBuilder.importStrategyFromToolbar("MartingaleOld");
    common.snackBar.should("have.text", "You’ve successfully imported a bot.");
  });
});
