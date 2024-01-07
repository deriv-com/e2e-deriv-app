const mt5locators=require('../PageElements/mt5Page.json')
const mt5timeout=10000
class mt5_tradershub{

    get tradershubDropDown() {
        return cy.get(mt5locators.mt5Locators.tradershubDropDown);
      }

    get selectDemo()
    {
        return cy.get(mt5locators.mt5Locators.demo);
    }
    get cfdstitle()
    {
      return cy.xpath(mt5locators.mt5Locators.cfdsaccounttitle)
    }
    get mt5tradingdetails()
    {
      return cy.get(mt5locators.mt5Locators.mt5tradingdetails)
    }
    waitForElementVisible(element)
    {
        //cy.get(element, { timeout: mt5timeout}).should('be.visible');
        //const multiSelector = `${this.timerLocator}, :contains("No Match Found")`;
        //return cy.get(multiSelector, { timeout: 60000 });
        return cy.get(element).should('be.visible').then(() => true).catch(() => false);
    }
    buttonClick=(el)=>
    {
       // cy.wait(10000);
        el.should('be.visible').click();
    
    };
    dismissNewChartDialouge=()=>
    {
        cy.get('#modal_root, .modal-root', { timeout: 10000 })
        .then(($element) => {
         if ($element.children().length > 0) {
        cy.contains("Continue").then(($element) => {
        if ($element.length) {
        cy.wrap($element).click()
        }
     
        })
            } else {
                    cy.log("fixed.");
                    }
            })
    };
  
    verifyText=(webelement,expectedText)=>
    {
        cy.get(webelement)
        .then(($element) => {
          expect($element.text()).to.be.eq(expectedText)
          
        });
    };
    // combined functions
    selectDemoAccount =() =>{
        
      //this.tradershubDropDown.click();
       const tradersHub=this.tradershubDropDown;
       this.buttonClick(tradersHub);
       this.buttonClick(this.selectDemo);
       
    };
verifyMFHasCFDsDemoAccount=()=>{

  let demoName
  cy.get(mt5locators.mt5Locators.mt5tradingdetails)
  .find('span')
  .eq(4)
  .invoke('text')
  .then((text) => {
    demoName = text.trim()
    cy.log("CFD offering for MF :: "+demoName);
    expect(demoName.trim()).to.equal("CFDs Demo");
  })
    };
  verifyMT5DemoPasswordModal=()=>
  {
    let mt5PasswordTitle
  cy.get(mt5locators.mt5Locators.mt5passwordmodeltitle).invoke('text').then((text) => {
    mt5PasswordTitle=text.trim();
    cy.log("MT5 DEMO Title:: "+mt5PasswordTitle);
    expect(mt5PasswordTitle).to.equal("Create a Deriv MT5 password");
  })

  };
  createMT5MFDemoCreate=()=>{
      this.buttonClick(mt5locators.mt5Locators.mt5cfddemobutton);
      this.verifyMT5DemoPasswordModal();

    };
}

export default new mt5_tradershub();