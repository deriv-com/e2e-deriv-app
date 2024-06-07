export const dTraderPageLocators = {
  mobileLocators: {
    //mobileLocator1 : () => cy.findByTestId('abc')
    //mobileLocator2 : () => cy.findByTestId('xyz')
    symbolExpandIcon: () => cy.get('.sc-mcd__category--active'),
  },
  desktopLocators: {
    //commonDesktopLocator1 : () => cy.findByTestId('abc')
    //commonDesktopLocator2 : () => cy.findByTestId('xyz')
    symbolExpandIcon: () =>
      cy.get(
        '.ic-icon.sc-mcd__filter__group-icon.sc-mcd__filter__group-icon--open'
      ),
    chartCurrentPrice: () => cy.get('.cq-current-price'),
    contractCard: (waitDuration) =>
      cy.get('.dc-contract-card', { timeout: waitDuration }),
    contractBuyRefID: () => {
      cy.findByTestId('dt_id_label').get('.contract-audit__value')
    },
    contractSellRefID: () => {
      cy.findByTestId('dt_id_label').get('.contract-audit__value2')
    },
  },
  sharedLocators: {
    //commonLocator1 : () => cy.findByTestId('abc')
    //commonLocator2 : () => cy.findByTestId('xyz')
    symbolSelectBtn: (waitDuration) =>
      cy.get('.cq-symbol-select-btn', { timeout: waitDuration }),
  },
}
