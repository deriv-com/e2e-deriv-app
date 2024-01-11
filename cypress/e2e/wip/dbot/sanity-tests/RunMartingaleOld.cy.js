import LoginPage from "../pageobjects/login_page";
import TradersHub from "../pageobjects/traders_hub";
import Common from "../pageobjects/common";
import BotDashboard from "../pageobjects/bot_dashboard_page";
import RunPanel from "../pageobjects/run_panel";

describe("Import and run custom strategy", () => {
  const loginPage = new LoginPage();
  const tradersHub = new TradersHub();
  const common = new Common();
  const botDashboard = new BotDashboard();
  const runpanel = new RunPanel();
  let userName = Cypress.env("username_cr_unauthenticated");
  let totalPL;

  beforeEach(() => {
    cy.login_setup(userName);
    tradersHub.openBotButton.click();
    common.skipTour();
    common.switchToDemo();
  });

  it("Run Martingale Old Strategy", () => {
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

    runpanel.profitLossValue.then(($value) => {
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

    runpanel.transactionsTab.click(); //Switch to transactions tab

    //Verify Stake doubles after a loss
    runpanel.runPanelScrollbar.scrollTo("bottom", { ensureScrollable: false });
    runpanel.transactionAfterFirstLoss.should("have.text", "2.00 USD");
  });

  after(() => {
  botDashboard.deleteStrategy();
  });
});
