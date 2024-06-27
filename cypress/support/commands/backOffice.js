Cypress.Commands.add(
  'c_removeCRAccountCitizenship',
  (accountEmail, currency, brokerCode) => {
    cy.log(accountEmail)
    cy.log(currency)
    cy.log(brokerCode)
    cy.c_visitBackOffice()
    cy.findByText('Client Management').click()
    cy.contains('label', 'Email:')
      .next('input[placeholder="email@domain.com"]')
      .type(accountEmail)
    cy.findByText('View / Edit').click()
    //TODO improve logic for this in https://app.clickup.com/t/86bz8jf20
    if (currency == 'USD') {
      if (brokerCode == 'CR') {
        cy.findByText(/CR\d+ \(USD\)/).click()
      } else if (brokerCode == 'MF') {
        cy.findByText(/MF\d+ \(USD\)/).click()
      }
    } else if (currency == 'EUR') {
      if (brokerCode == 'CR') {
        cy.findByText(/CR\d+ \(EUR\)/).click()
      } else if (brokerCode == 'MF') {
        cy.findByText(/MF\d+ \(EUR\)/).click()
      }
    }
    cy.get('select[name="citizen"]').select('Select Citizen')
    cy.findAllByText('Save client details').eq(0).click()
    //TODO improve logic for this in https://app.clickup.com/t/86bz8jf20
    if (brokerCode == 'CR') {
      cy.findAllByText(/^Client CR\d+ saved$/).should('be.visible')
    } else if (brokerCode == 'MF') {
      cy.findAllByText(/^Client MF\d+ saved$/).should('be.visible')
    }
  }
)
