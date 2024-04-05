export const dTraderPageLocators = {
  mobileLocators: {
    //mobileLocator1 : () => cy.findByTestId('abc')
    //mobileLocator2 : () => cy.findByTestId('xyz')
  },
  desktopLocators: {
    //commonDesktopLocator1 : () => cy.findByTestId('abc')
    //commonDesktopLocator2 : () => cy.findByTestId('xyz')
    symbolExpandIcon: () =>
      cy.get(
        '.ic-icon.sc-mcd__filter__group-icon.sc-mcd__filter__group-icon--open'
      ),
  },
  sharedLocators: {
    //commonLocator1 : () => cy.findByTestId('abc')
    //commonLocator2 : () => cy.findByTestId('xyz')
    symbolSelectBtn: (waitDuration) =>
      cy.get('.cq-symbol-select-btn', { timeout: waitDuration }),
  },
}
