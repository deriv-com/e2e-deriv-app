import tradersHub from "../pageobjects/traders_hub";
import common from "../pageobjects/common";
import botBuilder from "../pageobjects/bot_builder_page";
import quickStrategy from "../pageobjects/quick_strategy";
import runPanel from "../pageobjects/run_panel";


describe("Verify Quick Strategy from bot builder page", () => {
  let userName = Cypress.env("username_cr_unauthenticated");

  beforeEach(() => {
    cy.login_setup(userName); //Need to replace with cy.c_login()
    tradersHub.openBotButton.click();
    common.skipTour();
    common.switchToDemo();
    botBuilder.openBotBuilderTab();
    common.skipTour();
    quickStrategy.clickQuickStrategies();
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
    common.runBot();
    runPanel.transactionsTab.click();

    //Verify Stake doubles after a loss
    runPanel.runPanelScrollbar.scrollTo("bottom", { ensureScrollable: false });
    runPanel.transactionAfterFirstLoss.should("have.text", "2.00 USD");
  });
});
