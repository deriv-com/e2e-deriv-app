import "@testing-library/cypress/add-commands";
import TradersHub from "../pageobjects/traders_hub";
import Common from "../pageobjects/common";
import BotDashboard from "../pageobjects/bot_dashboard_page";
import RunPanel from "../pageobjects/run_panel";

describe("QATEST-109419: Run custom strategy Even Odd", () => {
  const tradersHub = new TradersHub();
  const common = new Common();
  const botDashboard = new BotDashboard();
  const runPanel = new RunPanel();
  let beforePurchaseBalanceString;
  let beforePurchaseBalanceNumber;

  beforeEach(() => {
    cy.c_login();
    cy.c_visitResponsive("/appstore/traders-hub", "large");
    tradersHub.openBotButton.click();
    common.skipTour();
    common.switchToDemo();
  });


  it("Run Timely Balance Strategy", () => {
    botDashboard.importStrategy("EvenOdd");
    common.skipTour();

    common.accountBalance.then(($el) => {
      beforePurchaseBalanceString = $el.text();
      beforePurchaseBalanceNumber = parseFloat(
        common.removeCurrencyCode(common.removeComma($el.text()))
      );
    });

    common.runBot();
    common.stopBot(7000);
    runPanel.transactionsTab.click(); //Switch to transactions tab
      });
  });
    
  // after(() => {
  //   botDashboard.deleteStrategy();
  // });