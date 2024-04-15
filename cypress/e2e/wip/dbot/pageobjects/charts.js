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

  verifyTickChange = () => {
    cy.get('body').then(($body) => {
      if ($body.find('.cq-symbol-closed-text').length > 0) {
        cy.log('This market is closed currently')
      } else {
        let initialPrice
        let timeoutId
        this.chartPrice
          .invoke('text')
          .should('not.be.empty')
          .then((text) => {
            initialPrice = text
            cy.clock()
            const pollingInterval = 1000 // Set a custom interval (in milliseconds)
            //Create a function to check the price periodically
            const checkPrice = () => {
              this.chartPrice
                .invoke('text')
                .should('not.be.empty')
                .then((newPrice) => {
                  if (newPrice !== initialPrice) {
                    cy.log('if')
                    cy.log('Price changed:', newPrice)
                    //clearTimeout(timeoutId); // Clear the timeout
                  } else {
                    cy.log('else')
                    // If 10 seconds have passed, treat the case as failed
                    if (cy.clock().now() >= 10000) {
                      cy.log('Timeout: Price did not change within 10 seconds.')
                      // Fail the test explicitly
                      cy.wrap(true).should('equal', false)
                      return
                    }
                    // Otherwise, schedule the next check
                    timeoutId = setTimeout(checkPrice, pollingInterval)
                  }
                })
            }

            //Start the initial check
            timeoutId = setTimeout(checkPrice, pollingInterval)
          })
      }
    })
  }
}

export default new Charts()
