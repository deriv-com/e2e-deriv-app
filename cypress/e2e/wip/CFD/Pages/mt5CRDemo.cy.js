import '@testing-library/cypress/add-commands'

describe('Create all CR MT5 demo account', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })

  it('should be able to create all cr demo MT5 account', () => {

    cy.log('Successful login')

    cy.wait(2000)
    cy.log('Create Derived Demo')
    /*cy.findByTestId('dti_dropdown_display').click()
    cy.get('#real').click()
    cy.findByText('Swap-Free', { exact: true }).should('be.visible')*/
    cy.findByTestId('dt_dropdown_display').click().should('be.visible')
    cy.wait(2000)
    cy.get('#demo').click()
    cy.wait(2000)
    cy.findByText('Derived Demo', { exact: true }).should('be.visible')
    //cy.findByRole('button', { name: 'Get' }).first().click();
    //cy.get('.dc-text dc-btn__text').contains('Get').should('be.visible')

    let mt5Account = 'Derived Demo'

   cy.get('[class="trading-app-card__details"]')
   .contains(mt5Account)
   .parentsUntil('.trading-app-card__details').parent().siblings('.trading-app-card__actions').within(()=> {
    cy.get('button:contains("Get")').click()
   })



    
   /* cy.findByRole('button', { name: 'Get' }).first().click();
    cy.findByTestId('dt_mt5_password').click();
    cy.findByTestId('dt_mt5_password').fill('Qwer1234@');
    cy.findByRole('button', { name: 'Add account' }).click();
    cy.findByRole('button', { name: 'Continue' }).click();
    cy.findByRole('button', { name: 'Get' }).first().click();
    cy.findByTestId('dt_mt5_password').click();
    cy.findByTestId('dt_mt5_password').fill('Qwer1234@');
    cy.findByRole('button', { name: 'Add account' }).click();
    cy.findByRole('button', { name: 'Continue' }).click();
    cy.findByRole('button', { name: 'Get' }).first().click();
    cy.findByTestId('dt_mt5_password').click();
    cy.findByTestId('dt_mt5_password').fill('Qwer1234@');
    cy.findByRole('button', { name: 'Add account' }).click();
    cy.findByRole('button', { name: 'Continue' }).click();*/
  
  })

})