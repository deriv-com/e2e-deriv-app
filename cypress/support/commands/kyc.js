Cypress.Commands.add('navigate_to_poi', (country) => {
  cy.get('a[href="/account/personal-details"]').click()
  cy.findByRole('link', { name: 'Proof of identity' }).click()
  cy.findByLabel('Country').click()
  cy.findByText(country).click()
  cy.contains(country).click()
  cy.contains('button', 'Next').click()
})

Cypress.Commands.add('c_navigateToPOIResponsive', (country) => {
  cy.c_visitResponsive('/account/proof-of-identity', 'small')
  //cy.findByText('Proof of identity').should('exist')
  cy.findByText('Pending action required').should('exist')
  cy.c_closeNotificationHeader()
  cy.get('select[name="country_input"]').select(country)
  cy.findByRole('button', { name: 'Next' }).click()
})
