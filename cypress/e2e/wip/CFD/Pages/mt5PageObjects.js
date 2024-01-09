const locators=require('../PageElements/mt5TransferLocators.json')
class mt5_tradershub{

    get tradershubDropDown() {
        return cy.get(locators.mt5Locators.tradershubDropDown);
      }
    
    get selectReal()
    {
        return cy.get(locators.mt5Locators.real);
    }
    selectRealAccount =() =>{

       this.tradershubDropDown.click()
       this.selectReal.click()
       
    }
  
}

export default new mt5_tradershub();
