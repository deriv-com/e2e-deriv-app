import "@testing-library/cypress/add-commands";
import TradersHub from "../pageobjects/traders_hub";
import Common from "../pageobjects/common";
import BotDashboard from "../pageobjects/bot_dashboard_page";
import RunPanel from "../pageobjects/run_panel";
import BotBuilder from "../pageobjects/bot_builder_page";

describe("QATEST-109419: Run custom strategy Even Odd", () => {
  const tradersHub = new TradersHub();
  const common = new Common();
  const botDashboard = new BotDashboard();
  const runPanel = new RunPanel();
  const botBuilder = new BotBuilder();

  beforeEach(() => {
    cy.c_login();
    cy.c_visitResponsive("/bot", "large");
    common.skipTour();
    common.switchToDemo();
  });


  it("Run Even and Odd Purchase", () => {
    botDashboard.importStrategy("EvenOdd");
    common.skipTour();
    cy.reload();
    cy.wait(2000)
    common.runBot();
    common.stopBot(10000);
    runPanel.transactionsTab.click(); //Switch to transactions tab

    // Check if the even and odd purchased alternately
    botBuilder.digitEvenLogo.should('be.visible').then($elem2 => {
    // cy.xpath('(//*[name()="use" and contains(@*, "ic-tradetype-digiteven")])')
    // .should('be.visible')
    // .then($elem2 => {
    cy.xpath('(//*[name()="use" and contains(@*, "ic-tradetype-digitodd")])')
      .should('be.visible')
      .then($elem1 => {
        const rect1 = $elem1[0].getBoundingClientRect();
        const rect2 = $elem2[0].getBoundingClientRect();
        expect(rect1.top).to.be.greaterThan(rect2.top);
      });
  });

  });


    after(() => {
        //botDashboard.deleteStrategy();
    });
  });