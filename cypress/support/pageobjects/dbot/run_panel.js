class RunPanel {
  get transactionsTab() {
    return cy.get("li[id='db-run-panel-tab__transactions']")
  }

  get totalProfitLoss() {
    return cy.get('div.run-panel__stat-amount')
  }

  totalProfitLossEl = 'div.run-panel__stat-amount'

  get profitLossValue() {
    return cy.get("div.run-panel__stat-amount span[data-testid='dt_span']")
  }

  get runPanelScrollbar() {
    return cy.get("div[data-testid='dt_themed_scrollbars']").last()
  }
  get journalTab() {
    return cy.get("li[id='db-run-panel-tab__journal']")
  }

  get beforePurchase() {
    return cy.get('div.journal__text.journal__text--info').last()
  }

  get afterPurchase() {
    return cy.get('div.journal__text.journal__text--success').last()
  }

  get secondBeforePurchaseText() {
    return cy.get('div.journal__text.journal__text--info').eq(-2)
  }

  transactionAfterFirstLoss = () => {
    cy.findAllByTestId('dt_transactions_item')
      .get('.transactions__profit--loss')
      .last()
      .parents('.data-list__row--wrapper')
      .parent()
      .prev()
      .within(($el) => {
        cy.findByTestId('dt_transactions_item').should(
          'contain.text',
          '2.00 USD'
        )
      })
  }
}

export default RunPanel
