import tradersHub from "../pageobjects/traders_hub";
import common from "../pageobjects/common";
import botDashboard from "../pageobjects/bot_dashboard_page";
import runPanel from "../pageobjects/run_panel";

describe("Import and run custom strategy", () => {
  let userName = Cypress.env("username_cr_unauthenticated");
  let totalPL;

  beforeEach(() => {
    cy.login_setup(userName);
    tradersHub.openBotButton.click();
  });

  it("Run Martingale Old Strategy", () => {
    common.skipTour();
    common.switchToDemo();
    botDashboard.importStrategy("Martingale Old");
    common.skipTour();

    //Enter Expected profit, expected Loss, and Trade Amount
    cy.window().then((win) => {
      const martingaleValues = ["5", "4", "1"]; //Expected Profit, Expected Loss, Trade Amount
      let call = 0;
      cy.stub(win, "prompt").callsFake(() => {
        return martingaleValues[call++];
      });
      common.runBot();
    });

    //Wait for bot to complete
    common
      .getElementWithTimeout(common.botRunButtonEl, 3200000)
      .should("be.visible");

    runPanel.profitLossValue.then(($value) => {
      totalPL = $value.text();
    });

    common
      .getElementWithTimeout(runpanel.totalProfitLossEl, 3200000)
      .then(($amt) => {
        if ($amt.hasClass("run-panel__stat-amount--positive")) {
          cy.on("window:alert", (str) => {
            expect(str).to.contain(
              `Expected Profit Made! Total Profit: ${totalPL}`
            );
          });
        } else {
          cy.on("window:alert", (str) => {
            expect(str).to.contain(
              `Maximum Loss Occurred! Total Loss: ${totalPL}`
            );
          });
        }
      });

    runPanel.transactionsTab.click(); //Switch to transactions tab

    //Verify Stake doubles after a loss
    runPanel.runPanelScrollbar.scrollTo("bottom", { ensureScrollable: false });
    runPanel.transactionAfterFirstLoss.should("have.text", "2.00 USD");
  });

  after(() => {
    botDashboard.deleteStrategy();
  });
});
