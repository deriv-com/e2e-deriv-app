Cypress.Commands.add('navigateToPoi', (country) => {
    cy.get('a[href="/account/personal-details"]').click()
    cy.get('a[href="/account/proof-of-identity"]').click()
    cy.get('input[name="country_input"]').click()
    cy.get('input[name="country_input"]').type(country)
    cy.contains(country).click()
    cy.contains('button', 'Next').click()
  })
  
  Cypress.Commands.add("c_navigateToPoiResponsive", (country) => {
    cy.c_visitResponsive("/account/proof-of-identity", "small")
    cy.findByText("Pending action required").should('exist')
    cy.c_closeNotificationHeader()
    cy.get('select[name="country_input"]').select(country)
    cy.contains("button", "Next").click()
  })