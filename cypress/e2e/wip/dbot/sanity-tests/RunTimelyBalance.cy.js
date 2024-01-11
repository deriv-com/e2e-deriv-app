import tradersHub from "../pageobjects/traders_hub";
import common from "../pageobjects/common";
import botDashboard from "../pageobjects/bot_dashboard_page";
import runPanel from "../pageobjects/run_panel";

describe("Import and run custom strategy", () => {
  let userName = Cypress.env("username_cr_unauthenticated");
  let beforePurchaseBalanceString;
  let beforePurchaseBalanceNumber;
  let afterPurchaseBalanceString;

  beforeEach(() => {
    cy.login_setup(userName);
    tradersHub.openBotButton.click();
    cy.wait(6000);
    common.skipTour();
    common.switchToDemo();
  });

  it("Run Timely Balance Strategy", () => {
    botDashboard.importStrategy("TimelyBalance");
    common.skipTour();

    common.accountBalance.then(($el) => {
      beforePurchaseBalanceString = $el.text();
      beforePurchaseBalanceNumber = parseFloat(
        common.removeCurrencyCode(common.removeComma($el.text()))
      );
    });
    common.runBot();
    common.stopBot(7000);
    runPanel.journalTab.click();
    runPanel.runPanelScrollbar
      .scrollTo("bottom", { ensureScrollable: false })
      .then(() => {
        runPanel.secondBeforePurchaseText.then(($el) => {
          afterPurchaseBalanceString = $el
            .text()
            .replace("[BEFORE_PURCHASE]:", "[AFTER_PURCHASE]:");
          runPanel.afterPurchase.should(
            "contain.text",
            afterPurchaseBalanceString
          );
        });
        runPanel.beforePurchase.should(
          "contain.text",
          `[BEFORE_PURCHASE]:   Number:  ${beforePurchaseBalanceNumber}      --      String:  ${beforePurchaseBalanceString}`
        );
      });
  });

  after(() => {
    botDashboard.deleteStrategy();
  });
});
