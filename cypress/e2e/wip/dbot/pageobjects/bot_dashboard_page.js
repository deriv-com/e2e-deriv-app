import { FILEPATH } from "../constants";
class BotDashboard {
  get dashboardTab() {
    return cy
      .get("li[id='id-dbot-dashboard']", { timeout: 5000 })
      .contains("Dashboard");
  }

  get fileInput() {
    return cy.get(".tab__dashboard__table input[type=file]");
  }

  get openStrategyButton() {
    return cy.get("button.load-strategy__button-group--open");
  }

  get deleteStrategyButton() {
    return cy
      .get("div.load-strategy__recent-item__button", { timeout: 5000 })
      .last();
  }

  get deleteModalConfirm() {
    return cy.get("button span").contains("Yes, delete");
  }

  strategySaveStatus(strategyName) {
    return cy.xpath(
      `(//p[text()='${strategyName}']/parent::div/../following-sibling::div)[2]`
    );
  }

  /**
   * Import custom strategy from dashboard
   * @param strategyFileName File Name
   */
  importStrategy = (strategyFileName) => {
    this.fileInput.selectFile(FILEPATH + `${strategyFileName}.xml`, {
      force: true,
    });
    this.openStrategyButton.click();
  };

  /**
   * Delete a strategy from dashboard
   */
  deleteStrategy = () => {
    this.goToDashboard();
    this.deleteStrategyButton.click();
    this.deleteModalConfirm.click({ force: true });
  };

  goToDashboard = () => {
    this.dashboardTab.click();
  };
}

export default new BotDashboard();
