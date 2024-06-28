export const commonPageLocators = {
  mobileLocators: {
    header: {
      hamburgerMenuButton: () => cy.get('#dt_mobile_drawer_toggle'),
    },
    footer: {},
    sideMenu: {
      sidePanel: () => cy.get('#dt_mobile_drawer'),
      tradersHubButton: () => cy.findByText("Trader's Hub"),
      cashierButton: () => cy.findByText('Cashier'),
      depositButton: () => cy.findByText('Deposit'),
    },
    //commonMobileLocator1 : () => cy.findByTestId('abc')
    //commonMobileLocator2 : () => cy.findByTestId('xyz')
  },
  desktopLocators: {
    header: {
      tradersHubButton: () => cy.findByTestId('dt_traders_hub_home_button'),
      cashierButton: () => cy.findByText('Cashier'),
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
