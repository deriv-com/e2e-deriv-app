import "@testing-library/cypress/add-commands";
import TradersHub from "../pageobjects/traders_hub";
import Common from "../pageobjects/common";
import BotDashboard from "../pageobjects/bot_dashboard_page";
import RunPanel from "../pageobjects/run_panel";

describe("QATEST-99420: Import and run custom strategy", () => {
  const tradersHub = new TradersHub();
  const common = new Common();
  const botDashboard = new BotDashboard();
  const runPanel = new RunPanel();
  let totalPL;

  

  beforeEach(() => {
    cy.c_login();
    cy.c_visitResponsive("/appstore/traders-hub", "large");
    tradersHub.openBotButton.click();
    // cy.visit('/bot', {
    //   onBeforeLoad(win) {
    //     cy.stub(win, "prompt").onFirstCall().returns('5').onSecondCall().returns('4').onThirdCall().returns('1')
    //   }
    // })
    common.skipTour();
    common.switchToDemo();
  });

  it("Run Martingale Old Strategy", () => {
    botDashboard.importStrategy("MartingaleOld");
    common.skipTour();
let a = 5

    
    cy.window().then((win) => {
     //Enter Expected Profit, Maximum Loss Amount, and Trade Amount
      cy.stub(win, "prompt").onFirstCall().returns('5').onSecondCall().returns('4').onThirdCall().returns('1')
    })
    common.runBot();

    //Wait for bot to complete
    common
      .getElementWithTimeout(common.botRunButtonEl, 120000)
      .should("be.visible");

    runPanel.profitLossValue.then(($value) => {
      totalPL = $value.text();
    });

    common
      .getElementWithTimeout(runPanel.totalProfitLossEl, 120000)
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

  // after(() => {
  //   botDashboard.deleteStrategy();
  // });
});
