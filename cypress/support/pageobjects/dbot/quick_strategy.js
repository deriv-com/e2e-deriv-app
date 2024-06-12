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
    return cy.xpath('//input[@data-testid="dt_qs_symbol"]')
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

  chooseTradeType = (isMobile = false) => {
    const index = isMobile ? 1 : 3
    cy.findAllByTestId('dt_themed_scrollbars')
      .eq(index)
      .should('be.visible')
      .within(() => {
        cy.findByText('Matches/Differs').click()
      })
  }

  fillUpContractSize = () => {
    this.quickStrategySize.clear()
    this.quickStrategySize.type('{moveToEnd}2')
  }

  fillUpLossProfitTreshold = () => {
    this.quickStrategyLoss.type('4')
    this.quickStrategyProfit.type('9')
  }
}

export default QuickStrategy
