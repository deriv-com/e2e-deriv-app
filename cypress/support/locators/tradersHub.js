export const tradersHubPageLocators = {
  mobileLocators: {
    //mobileLocator1 : () => cy.findByTestId('abc')
    //mobileLocator2 : () => cy.findByTestId('xyz')
  },
  desktopLocators: {
    //commonDesktopLocator1 : () => cy.findByTestId('abc')
    //commonDesktopLocator2 : () => cy.findByTestId('xyz')
  },
  sharedLocators: {
    legacyAccountInfo: () => cy.get('.header__acc-info'),
  },
}
