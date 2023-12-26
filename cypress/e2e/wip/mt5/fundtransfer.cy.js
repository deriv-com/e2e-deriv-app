import '@testing-library/cypress/add-commands'
import { waitFor } from '@testing-library/dom'

describe('QATEST-5778, QATEST-5781, QATEST-5615', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })
  let transferAmount='10'
  let mt5Account='Derived SVG'
  let fiataccount='US Dollar'
  function mt5fundtransfer(fromaccount,toaccount){
    
    cy.findByText("Transfer funds to your accounts", {
        exact: true,
      }).should("be.visible")
    cy.get('[class="dc-dropdown-container account-transfer-form__drop-down"]').should("be.visible").click()
    
    cy.get('[class="dc-dropdown__list dc-dropdown__list--enter-done"]').should('be.visible').within(
        () => {
            cy.get('[data-testid="dti_list_item"]').contains(fromaccount).scrollIntoView().click({force:true})
        }
    )
    cy.get('[class="dc-dropdown-container account-transfer-form__drop-down account-transfer-form__drop-down--to-dropdown"]').should("be.visible").click()
    
    cy.get('[class="dc-dropdown__list dc-dropdown__list--enter-done"]').should('be.visible').within(
        () => {
            cy.get('[data-testid="dti_list_item"]').contains(toaccount).scrollIntoView().click({force:true})
        }
    )
    cy.findByTestId('dt_account_transfer_form_input').click().type(transferAmount);
    cy.get('[data-testid="dt_account_transfer_form_submit"]').contains('Transfer').should('be.visible').click();
    cy.findByText("Your funds have been transferred", {
        exact: true,
      }).should("be.visible")
    cy.get('[class="account-transfer-receipt__crypto--form-submit"]').should('be.visible').contains('Close').click()
    
  }

  it('MT5 account deposit, USD to Derived SVG',() => {

    cy.findByTestId('dt_dropdown_display').click()
    cy.get('#real').click()
    cy.wait(5000)
    
    cy.get('[class="trading-app-card__container trading-app-card--divider"]')
    .contains(mt5Account.split(" ")[0])
    .next()
    .contains(mt5Account.split(" ")[1])
    .parentsUntil('.trading-app-card__details').next().children().invoke('text').as('balancebefore')

    cy.get('[data-testid="dt_balance_text_container"]').eq(1).children().eq(0).invoke('text').as('usdbalancebefore')
    cy.get('@usdbalancebefore').then(usdbalancebefore => {
      usdbalancebefore = Number(usdbalancebefore.replace(/[^0-9.-]+/g,""))

    cy.get('@balancebefore').then(balbefore => {
      balbefore = Number(balbefore.replace(/[^0-9.-]+/g,""))

      cy.get('[class="trading-app-card__container trading-app-card--divider"]')
      .contains(mt5Account.split(" ")[0])
      .next()
      .contains(mt5Account.split(" ")[1])
      .parentsUntil('.trading-app-card__details').parent().siblings('.trading-app-card__actions').within(()=> {
        cy.get('button:contains("Transfer")').click()
      })

      mt5fundtransfer(fiataccount,mt5Account)
      cy.wait(2000)

      cy.get('[class="trading-app-card__container trading-app-card--divider"]')
      .contains(mt5Account.split(" ")[0])
      .next()
      .contains(mt5Account.split(" ")[1])
      .parentsUntil('.trading-app-card__details').next().children().invoke('text').as('balanceafter')    
        cy.get('@balanceafter').then(balafter => {
          balafter = Number(balafter.replace(/[^0-9.-]+/g,""))
          expect(balafter).to.eq(balbefore+parseInt(transferAmount))
        })
      })
      cy.get('[data-testid="dt_balance_text_container"]').eq(1).children().eq(0).invoke('text').as('usdbalanceafter')
      cy.get('@usdbalanceafter').then(usdbalanceafter => {
        usdbalanceafter = Number(usdbalanceafter.replace(/[^0-9.-]+/g,""))
        expect(usdbalanceafter).to.eq(usdbalancebefore-parseInt(transferAmount))

      })
    })
  })

  it('MT5 account withdrawal, Derived SVG to USD',() => {

    cy.findByTestId('dt_dropdown_display').click()
    cy.get('#real').click()
    cy.wait(5000)
    
    cy.get('[class="trading-app-card__container trading-app-card--divider"]')
    .contains(mt5Account.split(" ")[0])
    .next()
    .contains(mt5Account.split(" ")[1])
    .parentsUntil('.trading-app-card__details').next().children().invoke('text').as('balancebefore')

    cy.get('[data-testid="dt_balance_text_container"]').eq(1).children().eq(0).invoke('text').as('usdbalancebefore')
    cy.get('@usdbalancebefore').then(usdbalancebefore => {
      usdbalancebefore = Number(usdbalancebefore.replace(/[^0-9.-]+/g,""))

    cy.get('@balancebefore').then(balbefore => {
      balbefore = Number(balbefore.replace(/[^0-9.-]+/g,""))

      cy.get('[class="trading-app-card__container trading-app-card--divider"]')
      .contains(mt5Account.split(" ")[0])
      .next()
      .contains(mt5Account.split(" ")[1])
      .parentsUntil('.trading-app-card__details').parent().siblings('.trading-app-card__actions').within(()=> {
        cy.get('button:contains("Transfer")').click()
      })

      mt5fundtransfer(mt5Account,fiataccount)
      cy.wait(2000)

      cy.get('[class="trading-app-card__container trading-app-card--divider"]')
      .contains(mt5Account.split(" ")[0])
      .next()
      .contains(mt5Account.split(" ")[1])
      .parentsUntil('.trading-app-card__details').next().children().invoke('text').as('balanceafter')    
        cy.get('@balanceafter').then(balafter => {
          balafter = Number(balafter.replace(/[^0-9.-]+/g,""))
          expect(balafter).to.eq(balbefore-parseInt(transferAmount))
        })
      })

      cy.get('[data-testid="dt_balance_text_container"]').eq(1).children().eq(0).invoke('text').as('usdbalanceafter')
      cy.get('@usdbalanceafter').then(usdbalanceafter => {
        usdbalanceafter = Number(usdbalanceafter.replace(/[^0-9.-]+/g,""))
        expect(usdbalanceafter).to.eq(usdbalancebefore+parseInt(transferAmount))

      })
  })
  })

})