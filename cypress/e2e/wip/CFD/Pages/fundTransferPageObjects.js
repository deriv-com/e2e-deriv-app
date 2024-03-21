const locators = require('../PageElements/mt5TransferLocators.json')

class FundTransferPageObjects {
  transferAmount = '10'
  mt5Account = 'Derived SVG'
  fiatAccount = 'US Dollar'

  mt5Deposit = () => {
    cy.get(locators.fundTransferLocators.mt5AccountHandle)
      .contains(this.mt5Account.split(' ')[0])
      .next()
      .contains(this.mt5Account.split(' ')[1])
      .parentsUntil(locators.fundTransferLocators.mt5TradingDetails)
      .next()
      .children()
      .invoke('text')
      .as('mt5BalanceBefore')

    cy.get(locators.fundTransferLocators.usdBalanceLabel)
      .eq(1)
      .children()
      .eq(0)
      .invoke('text')
      .as('usdBalanceBefore')

    cy.get('@usdBalanceBefore').then((usdBalanceBefore) => {
      usdBalanceBefore = Number(usdBalanceBefore.replace(/[^0-9.-]+/g, ''))

      cy.get('@mt5BalanceBefore').then((mt5BalanceBefore) => {
        mt5BalanceBefore = Number(mt5BalanceBefore.replace(/[^0-9.-]+/g, ''))

        cy.get(locators.fundTransferLocators.mt5AccountHandle)
          .contains(this.mt5Account.split(' ')[0])
          .next()
          .contains(this.mt5Account.split(' ')[1])
          .parentsUntil(locators.fundTransferLocators.mt5TradingDetails)
          .parent()
          .siblings(locators.fundTransferLocators.mt5TradingActions)
          .within(() => {
            cy.get(
              locators.fundTransferLocators.transferButtonOnTradersHub
            ).click()
          })

        this.mt5FundTransfer(this.fiatAccount, this.mt5Account)
        cy.wait(2000)

        cy.get(locators.fundTransferLocators.mt5AccountHandle)
          .contains(this.mt5Account.split(' ')[0])
          .next()
          .contains(this.mt5Account.split(' ')[1])
          .parentsUntil(locators.fundTransferLocators.mt5TradingDetails)
          .next()
          .children()
          .invoke('text')
          .as('mt5BalanceAfter')
        cy.get('@mt5BalanceAfter').then((mt5BalanceAfter) => {
          mt5BalanceAfter = Number(mt5BalanceAfter.replace(/[^0-9.-]+/g, ''))
          expect(mt5BalanceAfter).to.eq(
            mt5BalanceBefore + parseInt(this.transferAmount)
          )
        })
      })
      cy.get(locators.fundTransferLocators.usdBalanceLabel)
        .eq(1)
        .children()
        .eq(0)
        .invoke('text')
        .as('usdBalanceAfter')
      cy.get('@usdBalanceAfter').then((usdBalanceAfter) => {
        usdBalanceAfter = Number(usdBalanceAfter.replace(/[^0-9.-]+/g, ''))
        expect(usdBalanceAfter).to.eq(
          usdBalanceBefore - parseInt(this.transferAmount)
        )
      })
    })
  }
  mt5Withdrawal = () => {
    cy.get(locators.fundTransferLocators.mt5AccountHandle)
      .contains(this.mt5Account.split(' ')[0])
      .next()
      .contains(this.mt5Account.split(' ')[1])
      .parentsUntil(locators.fundTransferLocators.mt5TradingDetails)
      .next()
      .children()
      .invoke('text')
      .as('mt5BalanceBefore')

    cy.get(locators.fundTransferLocators.usdBalanceLabel)
      .eq(1)
      .children()
      .eq(0)
      .invoke('text')
      .as('usdBalanceBefore')
    cy.get('@usdBalanceBefore').then((usdBalanceBefore) => {
      usdBalanceBefore = Number(usdBalanceBefore.replace(/[^0-9.-]+/g, ''))

      cy.get('@mt5BalanceBefore').then((mt5BalanceBefore) => {
        mt5BalanceBefore = Number(mt5BalanceBefore.replace(/[^0-9.-]+/g, ''))

        cy.get(locators.fundTransferLocators.mt5AccountHandle)
          .contains(this.mt5Account.split(' ')[0])
          .next()
          .contains(this.mt5Account.split(' ')[1])
          .parentsUntil(locators.fundTransferLocators.mt5TradingDetails)
          .parent()
          .siblings(locators.fundTransferLocators.mt5TradingActions)
          .within(() => {
            cy.get(
              locators.fundTransferLocators.transferButtonOnTradersHub
            ).click()
          })
        this.mt5FundTransfer(this.mt5Account, this.fiatAccount)
        cy.wait(2000)

        cy.get(locators.fundTransferLocators.mt5AccountHandle)
          .contains(this.mt5Account.split(' ')[0])
          .next()
          .contains(this.mt5Account.split(' ')[1])
          .parentsUntil(locators.fundTransferLocators.mt5TradingDetails)
          .next()
          .children()
          .invoke('text')
          .as('mt5BalanceAfter')
        cy.get('@mt5BalanceAfter').then((mt5BalanceAfter) => {
          mt5BalanceAfter = Number(mt5BalanceAfter.replace(/[^0-9.-]+/g, ''))
          expect(mt5BalanceAfter).to.eq(
            mt5BalanceBefore - parseInt(this.transferAmount)
          )
        })
      })

      cy.get(locators.fundTransferLocators.usdBalanceLabel)
        .eq(1)
        .children()
        .eq(0)
        .invoke('text')
        .as('usdBalanceAfter')
      cy.get('@usdBalanceAfter').then((usdBalanceAfter) => {
        usdBalanceAfter = Number(usdBalanceAfter.replace(/[^0-9.-]+/g, ''))
        expect(usdBalanceAfter).to.eq(
          usdBalanceBefore + parseInt(this.transferAmount)
        )
      })
    })
  }

  mt5FundTransfer = (fromaccount, toaccount) => {
    cy.findByText('Transfer funds to your accounts', {
      exact: true,
    }).should('be.visible')
    cy.get(locators.fundTransferLocators.mt5TransferFromDropdown)
      .should('be.visible')
      .click()

    cy.get(locators.fundTransferLocators.dropdownList)
      .should('be.visible')
      .within(() => {
        cy.get(locators.fundTransferLocators.dropdownEntry)
          .contains(fromaccount)
          .scrollIntoView()
          .click({ force: true })
      })
    cy.get(locators.fundTransferLocators.mt5TransferToDropdown)
      .should('be.visible')
      .click()

    cy.get(locators.fundTransferLocators.dropdownList)
      .should('be.visible')
      .within(() => {
        cy.get(locators.fundTransferLocators.dropdownEntry)
          .contains(toaccount)
          .scrollIntoView()
          .click({ force: true })
      })
    cy.findByTestId(locators.fundTransferLocators.transferInputTestId)
      .click()
      .type(this.transferAmount)
    cy.get(locators.fundTransferLocators.transferSubmitButton)
      .contains('Transfer')
      .should('be.visible')
      .click()
    cy.findByText('Your funds have been transferred', {
      exact: true,
    }).should('be.visible')
    cy.get(locators.fundTransferLocators.closeButton)
      .should('be.visible')
      .contains('Close')
      .click()
  }
}
export default new FundTransferPageObjects()
