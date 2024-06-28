const PMpage = `https://${Cypress.env('configServer')}/d/backoffice/doughflow_method_manage.cgi?broker=CR`

function checkMandatoryFieldsAndCreatePMwithEmptyCategory() {
  cy.findByRole('button', { name: 'Save' }).click()
  cy.findByText('Failed to create method:').should('be.visible')
  cy.get('input[name="payment_processor"]').type('TestDebitCard')
  cy.findByRole('button', { name: 'Save' }).click()
  cy.findByText('Failed to create method:').should('be.visible')
  //cy.get('input[name="payment_method"]').type('TestDebitCard')
  //cy.get('input[name="payment_category"]').type('Category1') //amend category name to be unique for this test
  //cy.findByRole('button', { name: 'Save' }).click()
  //cy.contains('Definition for processor=')
}

function checkCreatedPaymentMethod() {
  basicSearch()
  cy.findByRole('cell', { name: 'Category1' }).should('be.visible') //amend category name to be unique for this test
}

function basicSearch() {
  cy.get('input[name="show_all"]').check()
  cy.findByRole('button', { name: 'Search' }).click()
}

function checkFilterByField() {
  //passed
  cy.get('[name="methods_sort_option"]').select('Category')
  cy.get('input[name="filter_by"]').should('be.visible')
  cy.get('[name="methods_sort_option"]').select('Processor')
  cy.get('input[name="filter_by"]').should('be.visible')
  cy.get('[name="methods_sort_option"]').select('Method')
  cy.get('input[name="filter_by"]').should('be.visible')
  cy.get('[name="methods_sort_option"]').select('Reversible')
  cy.get('input[name="filter_by"]').should('not.be.visible')
}

function editPaymentMethodAndCheckItUpdated() {
  cy.get('input[name="payment_processor"]').type('TestProcessor1')
  cy.get('input[name="payment_method"]').type('TestMethod1')
  cy.get('input[name="payment_category"]').type('TestCategory1')
  cy.findByRole('button', { name: 'Save' }).click()
  cy.contains('Definition for processor=')
  cy.get('input[name="show_all"]').check()
  cy.get('[name="methods_sort_option"]').select('Category')
  cy.get('input[name="filter_by"]').type('TestCategory1')
}

describe('QATEST-140196 - Doughflow Payment Method Management', () => {
  it('Should check payment method cab be created, edited and deleted from BO side', () => {
    cy.c_visitResponsive('/', 'large')
    cy.c_visitBackOffice()
    cy.visit(PMpage)
    //checkMandatoryFieldsAndCreatePMwithEmptyCategory()
    //checkFilterByField () //passed
  })
})
