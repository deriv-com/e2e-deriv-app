const PMpage = `https://${Cypress.env('configServer')}/d/backoffice/doughflow_method_manage.cgi?broker=CR`

function checkAndCreatePM1() {
  cy.get('input[name="payment_processor"]').type('DebitCard')
  cy.get('input[name="payment_method"]').type('DebitCard')
  cy.get('input[name="payment_category"]').type('Category1')
  cy.findByRole('button', { name: 'Save' }).click()
  cy.contains('Definition for processor=')
}

function checkAndCreatePM2() {
  cy.get('input[name="payment_processor"]').type('CreditCard')
  cy.get('input[name="payment_method"]').type('CreditCard')
  cy.get('input[name="payment_category"]').type('Category2')
  cy.findByRole('button', { name: 'Save' }).click()
  cy.contains('Definition for processor=')
}

function checkAndCreatePM3() {
  cy.get('input[name="payment_processor"]').type('PaymentCard')
  cy.get('input[name="payment_method"]').type('PaymentCard')
  cy.get('input[name="payment_category"]').type('Category3')
  cy.findByRole('button', { name: 'Save' }).click()
  cy.contains('Definition for processor=')
}

function verifyFilteringByCategory1() {
  cy.get('input[name="show_all"]').check()
  cy.get('[name="methods_sort_option"]').select('Category')
  //cy.get('option').contains('Category').click()
  cy.get('input[name="filter_by"]').type('Category1')
  cy.findByRole('button', { name: 'Search' }).click()
  cy.findByRole('cell', { name: 'Category1' }).should('be.visible')
  cy.findByRole('cell', { name: 'Category2' }).should('not.exist')
  cy.findByRole('cell', { name: 'Category3' }).should('not.exist')
}

describe('P2PS-2560 - Sorting using category in BO Doughflow payment methods management page', () => {
  it('Should check sorting of Payment Methods in BO', () => {
    cy.c_visitResponsive('/', 'large')
    cy.c_visitBackOffice()
    cy.visit(PMpage)
    cy.get('input[name="show_all"]').check()
    cy.findByRole('button', { name: 'Search' })
      .click()
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          checkAndCreatePM1()
          cy.log('Added PM1 category')
        } else cy.log('PM1 category exists')
      })
    //checkAndCreatePM2 ()
    //checkAndCreatePM3 ()
    verifyFilteringByCategory1()
  })
})
