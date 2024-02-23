Cypress.Commands.add('redirectToP2P', () => {
    // click on hamburger menu
    cy.get("#dt_mobile_drawer_toggle").should("be.visible")
    cy.get("#dt_mobile_drawer_toggle").click()
    // click on cashier 
    cy.get('.dc-mobile-drawer__body > :nth-child(4)').should("be.visible").click()
    // click on P2P 
    cy.findByText("Deriv P2P").should("be.visible").click()
    // confirm warning messageF
    cy.get('.dc-checkbox__box').should("be.visible").click()
    cy.findByRole("button", { name: "Confirm" }).click()
  })
  

Cypress.Commands.add('postBuyAd', () => {
    cy.findByTestId('offer_amount').click().type('10')
    cy.findByTestId('float_rate_type').click().clear().type(rate, { parseSpecialCharSequences: false })
    cy.findByTestId('min_transaction').click().clear().type('5')
    cy.findByTestId('max_transaction').click().clear().type('10')
    cy.addPaymentMethod()
    cy.postAd()
  
  })

Cypress.Commands.add('addPaymentMethod', () => {
    cy.findByPlaceholderText('Add').click()
    cy.findByText('Other').click()
    cy.findByPlaceholderText('Add').click()
    cy.findByText('Bank Transfer').click()
    cy.findByPlaceholderText('Add').click()
    cy.findByText('Skrill').click()
    cy.findByPlaceholderText('Add').should('not.be.exist')
  })

Cypress.Commands.add('postAd', () => { 
    cy.findByRole("button", { name: "Post ad" }).should("be.enabled").click()
    cy.findByRole("button", { name: "Ok" }).should("be.enabled").click()
})