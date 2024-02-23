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