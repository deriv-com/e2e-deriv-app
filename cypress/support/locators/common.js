export const commonPageLocators = {
  mobileLocators: {
    header: {},
    footer: {},
    //commonMobileLocator1 : () => cy.findByTestId('abc')
    //commonMobileLocator2 : () => cy.findByTestId('xyz')
  },
  desktopLocators: {
    header: {
      tradersHubButton: () => cy.findByTestId('dt_traders_hub_home_button'),
    },
    footer: {},
    //commonDesktopLocator1 : () => cy.findByTestId('abc')
    //commonDesktopLocator2 : () => cy.findByTestId('xyz')
  },
  sharedLocators: {
    header: {},
    footer: {},
    //commonLocator1 : () => cy.findByTestId('abc')
    //commonLocator2 : () => cy.findByTestId('xyz')
  },
}
