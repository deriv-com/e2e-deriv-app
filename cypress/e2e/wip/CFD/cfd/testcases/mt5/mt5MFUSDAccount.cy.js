import "@testing-library/cypress/add-commands"
import mt5tradershub from "../../pageobjects/mt5_tradershub_page"
const mt5locators=require('../../PageElements/mt5Page.json')

describe("CFDS-2861- Create  MT5 account with USD for Demo on MF account", () => {
        beforeEach(() => {
          cy.clearCookies() 
          cy.clearLocalStorage()
          cy.c_login()
          cy.c_visitResponsive('/appstore/traders-hub', 'large')
        })
it("Should be able to successfully create mt5 MF demo account", () => {
cy.log("Create MT5  Demo Account")

cy.wait(2000)
mt5tradershub.selectDemoAccount();
mt5tradershub.verifyText(mt5locators.mt5Locators.mt5cfdsaccounttitle,"CFDs");
mt5tradershub.verifyMFHasCFDsDemoAccount();

  })
})
