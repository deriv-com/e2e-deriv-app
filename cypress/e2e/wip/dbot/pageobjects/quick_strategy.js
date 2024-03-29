class QuickStrategy {
  get quickStrategyBotBuilder() {
    return cy.xpath('//*[@id="db-toolbar__get-started-button"]')
  }

  get quickStrategyTab() {
    return cy.xpath(
      `//span[@class="dc-text"and text()='${this.quickstrategyName1}']`
    )
  }

  get quickStrategyRunBtn() {
    return cy.xpath('//button[@class="dc-btn dc-btn--primary"]')
  }

  get quickStrategyEditBtn() {
    return cy.xpath('//button[@class="dc-btn dc-btn--secondary"]')
  }

  get quickStrategyMarketDropdown() {
    return cy.xpath('//input[@data-testid="qs_autocomplete_symbol"]')
  }

  get quickStrategyProfit() {
    return cy.xpath('//input[@name="profit"]')
  }

  get quickStrategyLoss() {
    return cy.xpath('//input[@name="loss"]')
  }

  get quickStrategySize() {
    return cy.xpath('//input[@name="size"]')
  }

  get quickStrategyTradeType() {
    return cy.get('[data-testid="qs_autocomplete_tradetype"]')
  }

  runBotQuickStrategy = () => {
    this.quickStrategyRunBtn.should('exist').click()
  }

  clickQuickStrategies = () => {
    this.quickStrategyBotBuilder.click()
    this.quickStrategyMarketDropdown.should('be.visible')
  }

  /**  Click on strategy title from qstrategy modal
   * @param qstrategyName strategy Name
   */
  clickOnStrategyTab = (qstrategyName) => {
    this.quickstrategyName1 = qstrategyName
    this.quickStrategyTab.should('be.visible').click()
  }

  chooseTradeType = () => {
    this.quickStrategyTradeType.click()
    cy.contains('Matches/Differs')
      .scrollIntoView()
      .then(($element) => {
        cy.wrap($element).click()
      })
  }

  fillUpContractSize = () => {
    this.quickStrategySize.clear()
    this.quickStrategySize.type('{moveToEnd}2')
  }

  fillUpLossProfitTreshold = () => {
    this.quickStrategyLoss.type('10')
    this.quickStrategyProfit.type('15')
  }
}

export default new QuickStrategy()
