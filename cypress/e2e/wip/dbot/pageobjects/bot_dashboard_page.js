import { FILEPATH } from "../constants"
class BotDashboard {
  get dashboardTab() {
    return cy.get("#id-dbot-dashboard", { timeout: 5000 }).contains("Dashboard")
  }

  get fileInput() {
    return cy.get(".tab__dashboard__table input[type=file]")
  }

  get openStrategyButton() {
    return cy.get("button.load-strategy__button-group--open")
  }

  get deleteStrategyButton() {
    return cy
      .get("div.bot-list__item__actions__action-item", { timeout: 5000 })
      .last()
  }

  get deleteModalConfirm() {
    return cy.get("button span").contains("Yes, delete")
  }

  strategySaveStatus(strategyName) {
    return cy.xpath(
      `(//p[text()='${strategyName}']/parent::div/../following-sibling::div)[2]`
    )
  }

  get botBuilderActiveTab() {
    return cy.xpath(
      `//li[contains(@class, "dc-tabs__item dc-tabs__active") and text()="Bot Builder"]`
    )
  }

  get botBuilderDash() {
    return cy.get("#IcBotBuilder")
  }

  get quickStrategyDash() {
    return cy.get("#IcQuickStrategy")
  }

  /**
   * Import custom strategy from dashboard
   * @param strategyFileName File Name
   */
  importStrategy = (strategyFileName) => {
    this.fileInput.selectFile(FILEPATH + `${strategyFileName}.xml`, {
      force: true,
    })
    this.openStrategyButton.click()
  }

  /**
   * Delete a strategy from dashboard
   */
  deleteStrategy = () => {
    this.goToDashboard()
    this.deleteStrategyButton.click()
    this.deleteModalConfirm.click({ force: true })
  }

  goToDashboard = () => {
    this.dashboardTab.click()
  }

  openBotBuilderQaction = () => {
    this.botBuilderDash.should("be.visible").click()
  }

  openQsQaction = () => {
    this.quickStrategyDash.should("be.visible").click()
  }
}

export default BotDashboard
