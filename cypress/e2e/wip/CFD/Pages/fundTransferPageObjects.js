const locators = require('../PageElements/mt5TransferLocators.json')

class FundTransferPageObjects{

    transferAmount="10"
    mt5Deposit = (fiatAccount,mt5Account) => {
        cy.get(locators.fundTransferLocators.mt5AccountHandle)
        .contains(mt5Account.split(" ")[0])
        .next()
        .contains(mt5Account.split(" ")[1])
        .parentsUntil(locators.fundTransferLocators.mt5TradingDetails).next().children().invoke('text').as('mt5BalanceBefore')

        cy.get(locators.fundTransferLocators.fiatBalanceLabel).eq(1).children().eq(0).invoke('text').as('fiatBalanceBefore')

        cy.get('@fiatBalanceBefore').then(fiatBalanceBefore => {
            fiatBalanceBefore = Number(fiatBalanceBefore.replace(/[^0-9.-]+/g,""))
      
        cy.get('@mt5BalanceBefore').then(mt5BalanceBefore => {
            mt5BalanceBefore = Number(mt5BalanceBefore.replace(/[^0-9.-]+/g,""))
      
            cy.get(locators.fundTransferLocators.mt5AccountHandle)
            .contains(mt5Account.split(" ")[0])
            .next()
            .contains(mt5Account.split(" ")[1])
            .parentsUntil(locators.fundTransferLocators.mt5TradingDetails).parent().siblings(locators.fundTransferLocators.mt5TradingActions).within(()=> {
              cy.get(locators.fundTransferLocators.transferButtonOnTradersHub).click()
            })

            cy.findByText("Transfer funds to your accounts", {
                exact: true,
              }).should("be.visible")
            cy.get(locators.fundTransferLocators.mt5TransferFromDropdown).should("be.visible").click()
            
            cy.get(locators.fundTransferLocators.dropdownList).should('be.visible').within(
                () => {
                    cy.get(locators.fundTransferLocators.dropdownEntry).contains(fiatAccount).scrollIntoView().click({force:true})
                }
            )
            cy.get(locators.fundTransferLocators.mt5TransferToDropdown).should("be.visible").click()
            
            cy.get(locators.fundTransferLocators.dropdownList).should('be.visible').within(
                () => {
                    cy.get(locators.fundTransferLocators.dropdownEntry).contains(mt5Account).scrollIntoView().click({force:true})
                }
            )

            if(fiatAccount=='US Dollar'){
                cy.findByTestId(locators.fundTransferLocators.transferInputTestId).click().type(this.transferAmount)
                cy.get(locators.fundTransferLocators.transferSubmitButton).contains('Transfer').should('be.visible').click()
                cy.findByText("Your funds have been transferred", {
                        exact: true,
                }).should("be.visible")
                cy.get(locators.fundTransferLocators.closeButton).should('be.visible').contains('Close').click()
                cy.wait(300)
                cy.get(locators.fundTransferLocators.mt5AccountHandle)
                    .contains(mt5Account.split(" ")[0])
                    .next()
                    .contains(mt5Account.split(" ")[1])
                    .parentsUntil(locators.fundTransferLocators.mt5TradingDetails).next().children().invoke('text').as('mt5BalanceAfter') 
                cy.get('@mt5BalanceAfter').then(mt5BalanceAfter => {
                    mt5BalanceAfter = Number(mt5BalanceAfter.replace(/[^0-9.-]+/g,""))
                    expect(mt5BalanceAfter).to.eq(mt5BalanceBefore+parseInt(this.transferAmount))        
                }) 
                
            }else{
                cy.findByTestId(locators.fundTransferLocators.fromAmountTestId).click().type(this.transferAmount)
                cy. findByTestId(locators.fundTransferLocators.toAmountTestId).invoke('val').as('convertedAmount').then(convertedAmount=>{
                convertedAmount = Number(convertedAmount.replace(/[^0-9.-]+/g,""))
                cy.get(locators.fundTransferLocators.transferSubmitButton).contains('Transfer').should('be.visible').click()
                cy.findByText("Your funds have been transferred", {
                        exact: true,
                }).should("be.visible")
                cy.get(locators.fundTransferLocators.closeButton).should('be.visible').contains('Close').click()
                cy.wait(300)
                cy.get(locators.fundTransferLocators.mt5AccountHandle)
                    .contains(mt5Account.split(" ")[0])
                    .next()
                    .contains(mt5Account.split(" ")[1])
                    .parentsUntil(locators.fundTransferLocators.mt5TradingDetails).next().children().invoke('text').as('mt5BalanceAfter') 

                cy.get('@mt5BalanceAfter').then(mt5BalanceAfter => {
                    mt5BalanceAfter = Number(mt5BalanceAfter.replace(/[^0-9.-]+/g,""))
                        expect(mt5BalanceAfter).to.eq(mt5BalanceBefore+parseFloat(convertedAmount))
                    })           
                                    
                })
            }
            
            })
            cy.get(locators.fundTransferLocators.fiatBalanceLabel).eq(1).children().eq(0).invoke('text').as('fiatBalanceAfter')
            cy.get('@fiatBalanceAfter').then(fiatBalanceAfter => {
                fiatBalanceAfter = Number(fiatBalanceAfter.replace(/[^0-9.-]+/g,""))
              expect(fiatBalanceAfter).to.eq(fiatBalanceBefore-parseInt(this.transferAmount))
      
            })
          })
        
    }
    mt5Withdrawal = (fiatAccount, mt5Account, ) => {
                    
        cy.get(locators.fundTransferLocators.mt5AccountHandle)
        .contains(mt5Account.split(" ")[0])
        .next()
        .contains(mt5Account.split(" ")[1])
        .parentsUntil(locators.fundTransferLocators.mt5TradingDetails).next().children().invoke('text').as('mt5BalanceBefore')

        cy.get(locators.fundTransferLocators.fiatBalanceLabel).eq(1).children().eq(0).invoke('text').as('fiatBalanceBefore')
        cy.get('@fiatBalanceBefore').then(fiatBalanceBefore => {
            fiatBalanceBefore = Number(fiatBalanceBefore.replace(/[^0-9.-]+/g,""))

      cy.get('@mt5BalanceBefore').then((mt5BalanceBefore) => {
        mt5BalanceBefore = Number(mt5BalanceBefore.replace(/[^0-9.-]+/g, ''))

        cy.get(locators.fundTransferLocators.mt5AccountHandle)
            .contains(mt5Account.split(" ")[0])
            .next()
            .contains(mt5Account.split(" ")[1])
            .parentsUntil(locators.fundTransferLocators.mt5TradingDetails).parent().siblings(locators.fundTransferLocators.mt5TradingActions).within(()=> {
              cy.get(locators.fundTransferLocators.transferButtonOnTradersHub).click()
        })

        cy.findByText("Transfer funds to your accounts", {
            exact: true,
          }).should("be.visible")
        cy.get(locators.fundTransferLocators.mt5TransferFromDropdown).should("be.visible").click()
        
        cy.get(locators.fundTransferLocators.dropdownList).should('be.visible').within(
            () => {
                cy.get(locators.fundTransferLocators.dropdownEntry).contains(mt5Account).scrollIntoView().click({force:true})
            }
        )
        cy.get(locators.fundTransferLocators.mt5TransferToDropdown).should("be.visible").click()
        
        cy.get(locators.fundTransferLocators.dropdownList).should('be.visible').within(
            () => {
                cy.get(locators.fundTransferLocators.dropdownEntry).contains(fiatAccount).scrollIntoView().click({force:true})
            }
        )

        if(fiatAccount=='US Dollar'){
            cy.findByTestId(locators.fundTransferLocators.transferInputTestId).click().type(this.transferAmount)
                cy.get(locators.fundTransferLocators.transferSubmitButton).contains('Transfer').should('be.visible').click()
                cy.findByText("Your funds have been transferred", {
                        exact: true,
                }).should("be.visible")
                cy.get(locators.fundTransferLocators.closeButton).should('be.visible').contains('Close').click()
                cy.wait(300)
                cy.get(locators.fundTransferLocators.mt5AccountHandle)
                    .contains(mt5Account.split(" ")[0])
                    .next()
                    .contains(mt5Account.split(" ")[1])
                    .parentsUntil(locators.fundTransferLocators.mt5TradingDetails).next().children().invoke('text').as('mt5BalanceAfter') 
                cy.get('@mt5BalanceAfter').then(mt5BalanceAfter => {
                    mt5BalanceAfter = Number(mt5BalanceAfter.replace(/[^0-9.-]+/g,""))
                    expect(mt5BalanceAfter).to.eq(mt5BalanceBefore-parseInt(this.transferAmount))     
                }) 
                cy.get(locators.fundTransferLocators.fiatBalanceLabel).eq(1).children().eq(0).invoke('text').as('fiatBalanceAfter')
                cy.get('@fiatBalanceAfter').then(fiatBalanceAfter => {
                    fiatBalanceAfter = Number(fiatBalanceAfter.replace(/[^0-9.-]+/g,""))
                    expect(fiatBalanceAfter).to.eq(fiatBalanceBefore+parseInt(this.transferAmount))

                })
        }else{
            if(fiatAccount=='Australian Dollar'){
                this.transferAmount=mt5BalanceBefore-1;
            }
            cy.findByTestId(locators.fundTransferLocators.fromAmountTestId).click().type(this.transferAmount)

            cy. findByTestId(locators.fundTransferLocators.toAmountTestId).invoke('val').as('convertedAmount').then(convertedAmount=>{
                cy.log(convertedAmount)
                convertedAmount = Number(convertedAmount.replace(/[^0-9.-]+/g,""))
                cy.get(locators.fundTransferLocators.transferSubmitButton).contains('Transfer').should('be.visible').click()
                cy.findByText("Your funds have been transferred", {
                    exact: true,
                }).should("be.visible")
                cy.get(locators.fundTransferLocators.closeButton).should('be.visible').contains('Close').click()
                cy.wait(300)
                cy.get(locators.fundTransferLocators.mt5AccountHandle)
                .contains(mt5Account.split(" ")[0])
                .next()
                .contains(mt5Account.split(" ")[1])
                .parentsUntil(locators.fundTransferLocators.mt5TradingDetails).next().children().invoke('text').as('mt5BalanceAfter') 
    
                cy.get('@mt5BalanceAfter').then(mt5BalanceAfter => {
                    mt5BalanceAfter = Number(mt5BalanceAfter.replace(/[^0-9.-]+/g,""))
                    
                    expect(mt5BalanceAfter).to.eq(Number((mt5BalanceBefore-parseFloat(this.transferAmount)).toFixed(2)))
                    
                  })
                
                cy.get(locators.fundTransferLocators.fiatBalanceLabel).eq(1).children().eq(0).invoke('text').as('fiatBalanceAfter')
                
                cy.get('@fiatBalanceAfter').then(fiatBalanceAfter => {
                      fiatBalanceAfter = Number(fiatBalanceAfter.replace(/[^0-9.-]+/g,""))
                      
                      expect(fiatBalanceAfter).to.eq(Number((fiatBalanceBefore+parseFloat(convertedAmount)).toFixed(2)))
                })
    
            }) //convertedamount end
    
        }
        
        }) //mt5 balance before end

        }) //fiatbefore end

    }


}
export default new FundTransferPageObjects()
