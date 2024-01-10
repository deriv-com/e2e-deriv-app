import "@testing-library/cypress/add-commands"
const mt5locators=require('../PageElements/mt5Tradershub.json')
const textVal=require('../PageElements/textValidation.json')
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
      return cy.xpath(mt5locators.mt5Locators.mt5CfdsAccountTitle)
    }
    get mt5tradingdetails()
    {
      return cy.get(mt5locators.mt5Locators.mt5TradingDetails)
    }
    get mt5DemoPassword()
    {
      return cy.get(mt5locators.mt5Locators.mt5InputPassword)
    }
  
    buttonClick=(el)=>
    {
       cy.log("Element is going to get clicked.");
       //el.should("be.visible").click();
       el.click();
       cy.log("Element has been clicked.");
    
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
    inputText=(element,textToEnter)=>
    {
      cy.get(element).should('be.visible').should('have.value', '').type(textToEnter);

    };
 
    selectDemoAccount =() =>{
       this.tradershubDropDown.should('be.visible').click();
       this.selectDemo.should('be.visible').click();
       
    };
verifyMFHasCFDsDemoAccount=()=>{
  let demoName
  cy.get(mt5locators.mt5Locators.mt5TradingDetails)
  .find('span')
  .eq(4)
  .should('be.visible')
  .invoke('text')
  .then((text) => {
    demoName = text.trim()
    cy.log("CFD offering for MF :: "+demoName);
    expect(demoName.trim()).to.equal(textVal.textValidation.mt5CFDsDemo);
  })
    };
  verifyMT5DemoPasswordModal=()=>
  {
    
    let mt5PasswordTitle
    let mt5Success
    let passwordgen
    cy.get(mt5locators.mt5Locators.mt5PasswordModelTitle).invoke('text').then((text) => {
    mt5PasswordTitle=text.trim();
    cy.log("MT5 DEMO Title:: "+mt5PasswordTitle);
    expect(mt5PasswordTitle).to.equal(textVal.textValidation.mt5CreatePasswordMsg);
  })
    passwordgen=this.generateRandomString();
    this.inputText(mt5locators.mt5Locators.mt5InputPassword,passwordgen);
    cy.wait(1000);
    cy.get(mt5locators.mt5Locators.mt5ButtonCreatePassword).should('be.visible').click();
    cy.wait(2000);
    
    cy.get('.dc-modal-body').should('be.visible').invoke('text')
      .then((text)=>{
        mt5Success =text.trim()
        cy.log("Message received :: "+mt5Success);
        expect(mt5Success).to.equal(textVal.textValidation.mt5DemoAccountSuccess);
      })
    cy.get(mt5locators.mt5Locators.mt5ButtonContinue).should('be.visible').click();
  

  };
  createMT5MFDemo=()=>{
      cy.get(mt5locators.mt5Locators.mt5ButtonCfdDemo).should('be.visible').click();
      this.verifyMT5DemoPasswordModal();

    };

    verifyDemoPageLanding=()=>{
      cy.get(mt5locators.mt5Locators.mt5TextAccountType)
      .should('have.text', 'demo');

    };
    verifyMDemoAccountDetailsValidation=()=>{
      let demoCurrency
      cy.get(mt5locators.mt5Locators.mt5TradingDetails)
      .find('span')
      .eq(4)
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        demoCurrency = text.trim()
        cy.log("CFD MF Demo Account Balance :: "+demoCurrency);
        expect(demoCurrency.trim()).to.equal(textVal.textValidation.mt5EURDemoBalance);
      })
        };
     generateRandomString=()=> {
          const characters = 'abcdefghijklmnopqrstuvwxyz';
          const specials = '!@#$';
          
          let randomLower = '';
          let randomUpper='';
          let specialletter='';
          let digit='';
          let finalLetter
          
        
          for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomLower += characters[randomIndex];
          }
          
          const randomUpperIndex = Math.floor(Math.random() * characters.length);
          randomUpper= characters[randomUpperIndex].toUpperCase();
         
          const randomSpecialIndex = Math.floor(Math.random() * specials.length);
          specialletter = specials[randomSpecialIndex];
          for (let i = 0; i < 3; i++) {
          const randomDigit = Math.floor(Math.random() * 10);
          digit = randomDigit;
            }
          finalLetter=randomUpper+randomLower+digit+specialletter;
          cy.log("Random string generated ::" + finalLetter);
          return finalLetter;
        };
        
}

export default new mt5_tradershub();