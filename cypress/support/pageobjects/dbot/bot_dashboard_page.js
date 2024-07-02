import { FILEPATH } from './constants'
class BotDashboard {
  get dashboardTab() {
    return cy.get('#id-dbot-dashboard', { timeout: 5000 }).contains('Dashboard')
  }

  get fileInput() {
    return cy.get('.tab__dashboard__table input[type=file]')
  }

  get drawerToggleMobile() {
    return cy.get('.dc-drawer__toggle')
  }

  get openStrategyButtonMobile() {
    return cy.findAllByTestId('dt_mobile_bot_list_action-open')
  }

  get openStrategyButtonDesktop() {
    return cy.findAllByTestId('dt_desktop_bot_list_action-open')
  }

  get moreActionButton() {
    return cy.get('.bot-list__item__actions').first().click()
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
    return cy.get('#IcBotBuilder')
  }

  get quickStrategyDash() {
    return cy.get('#IcQuickStrategy')
  }

  /**
   * Import custom strategy from dashboard
   * @param strategyFileName File Name
   */
  importStrategy = (strategyFileName) => {
    this.fileInput.selectFile(FILEPATH + `${strategyFileName}.xml`, {
      force: true,
    })
    cy.findByText('You’ve successfully imported a bot.').should('be.visible')
  }

  goToDashboard = () => {
    this.dashboardTab.click()
  }

  openBotBuilderQaction = () => {
    this.botBuilderDash.should('be.visible').click()
  }

  openQsQaction = () => {
    this.quickStrategyDash.should('be.visible').click()
  }
}

export default BotDashboard
