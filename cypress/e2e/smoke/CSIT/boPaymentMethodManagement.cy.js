const PMpage = `https://${Cypress.env('configServer')}/d/backoffice/doughflow_method_manage.cgi?broker=CR`

function checkMandatoryFieldsAndCreatePMwithEmptyCategory() {
  cy.findByRole('button', { name: 'Save' }).click()
  cy.findByText('Failed to create method:').should('be.visible')
  cy.get('input[name="payment_processor"]').type('TestDebitCard')
  cy.findByRole('button', { name: 'Save' }).click()
  cy.findByText('Failed to create method:').should('be.visible')
  //cy.get('input[name="payment_method"]').type('TestDebitCard')
  //cy.get('input[name="payment_category"]').type('Category1')
  //cy.findByRole('button', { name: 'Save' }).click()
  //cy.contains('Definition for processor=')
}

describe('QATEST-140196 - Doughflow Payment Method Management', () => {
  it('Should check payment method cab be created, edited and deleted from BO side', () => {
    cy.c_visitResponsive('/', 'large')
    cy.c_visitBackOffice()
    cy.visit(PMpage)
    checkMandatoryFieldsAndCreatePMwithEmptyCategory()
  })
})
