import TradersHub from "../pageobjects/traders_hub";
import LoginPage from "../pageobjects/login_page";
import Common from "../pageobjects/common";
import RunPanel from "../pageobjects/run_panel";
import BotBuilder from "../pageobjects/bot_builder_page";;
import quickStrategy from "../pageobjects/quick_strategy";


describe("Verify Quick Strategy from bot builder page", () => {
  const loginPage = new LoginPage();
  const tradersHub = new TradersHub();
  const common = new Common();
  const runPanel = new RunPanel();
  const botBuilder = new BotBuilder();
  let userName = Cypress.env("username_cr_unauthenticated");

  beforeEach(() => {
    cy.login_setup(userName); 
    tradersHub.openBotButton.click();
    common.skipTour();
    common.switchToDemo();
    botBuilder.openBotBuilderTab();
    common.skipTour();
    quickStrategy.clickQuickStrategies();
    cy.wait(3000);
  });

  it("Run Martingale Quick Strategy", () => {
    quickStrategy.clickOnStrategyTab("Martingale");
    quickStrategy.quickStrategyMarketDropdown.should(
      "have.value",
      "Volatility 100 (1s) Index"
    );
    quickStrategy.fillUpContractSize();
    quickStrategy.fillUpLossProfitTreshold();
    quickStrategy.runBotQuickStrategy();
    runPanel.transactionsTab.click();

    //Verify Stake doubles after a loss
    runPanel.runPanelScrollbar.scrollTo("bottom", { ensureScrollable: false });
    runPanel.transactionAfterFirstLoss.should("have.text", "2.00 USD");
  });
});
