class Charts {
  get chartsTab() {
    return cy.get('#id-charts')
  }

  get chartsLoader() {
    return cy.get('div.sc-loader-spin')
  }

  get chartPrice() {
    return cy.get('.cq-current-price')
  }

  get currentSymbol() {
    return cy.get('div.cq-symbol')
  }

  get symbolSearchBox() {
    return cy.get('div.sc-search-input')
  }

  get symbolSearchItemName() {
    return cy.get('div.sc-mcd__item__name')
  }

  openChartsTab = () => {
    this.chartsTab.should('be.visible').click()
  }

  waitForChartstoLoad = () => {
    this.chartsLoader.should('not.exist')
  }

  selectSymbolOnCharts = (symbolName) => {
    this.currentSymbol.should('be.visible').click()
    this.symbolSearchBox.type(symbolName)
    this.symbolSearchItemName.contains(symbolName).should('be.visible').click()
    this.currentSymbol.should('have.text', symbolName)
  }

  /**
   * Verify that price is updating on the charts
   * @param {*} symbol
   * @param {*} duration
   */

  verifyTickChange = (duration) => {
    cy.wait(duration)
    cy.get('body').then(($body) => {
      if ($body.find('.cq-symbol-closed-text').length > 0) {
        cy.log('This market is closed currently')
      } else {
        let initialPrice
        this.chartPrice
          .invoke('text')
          .should('not.be.empty')
          .then((text) => {
            initialPrice = text
          })
        cy.wait(duration)
        this.chartPrice
          .invoke('text')
          .should('not.be.empty')
          .then((text) => {
            expect(text).to.not.eq(initialPrice)
          })
      }
    })
  }
}

export default new Charts()
