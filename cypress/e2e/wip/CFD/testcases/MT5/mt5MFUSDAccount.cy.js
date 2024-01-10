import "@testing-library/cypress/add-commands"
import mt5tradershub from "../../Pages/mt5MFTradershubPage"
const mt5locators=require('../../PageElements/mt5TradershubLocators.json')
const textVal=require('../../PageElements/textValidation.json')

describe("CFDS-2847- Create all MF Demo CFDs accounts via Traders Hub", () => {
        beforeEach(() => {
          cy.clearCookies()
          cy.clearLocalStorage()
          cy.c_login()
          cy.c_visitResponsive('/appstore/traders-hub', 'large')
        })
it("Should be able to successfully create mt5 MF demo account", () => {
cy.log("Create MF MT5  Demo Account via Trader's Hub")
cy.wait(500)
mt5tradershub.selectDemoAccount()
mt5tradershub.verifyText(mt5locators.mt5Locators.mt5CfdsAccountTitle,textVal.textValidation.mt5CFD)
mt5tradershub.verifyDemoPageLanding()
mt5tradershub.verifyMFHasCFDsDemoAccount()
mt5tradershub.createMT5MFDemo()
mt5tradershub.verifyMDemoAccountDetailsValidation()
  })
})
