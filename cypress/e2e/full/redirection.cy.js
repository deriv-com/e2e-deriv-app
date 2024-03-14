import '@testing-library/cypress/add-commands'
describe('WALL-3591 -production bug WALL-3588', () => {
  beforeEach(() => {
    cy.c_login()
  })

  it('should remain logged in after redirection to another platform', () => {
    cy.findByTestId('dt_platform_switcher').click()
    cy.get('a[href="/bot"]').click()
    cy.get('.dc-dialog__footer > .dc-btn--secondary').click()
    cy.get('#id-charts').click()
    cy.get('.cq-top-ui-widgets > .ciq-menu > .cq-menu-btn').click()
    cy.get('.sc-mcd__item--1HZ10V > .sc-mcd__item__name').click()
    cy.findByTestId('dt_platform_switcher').click()
    cy.get('a[href="/"]').click()
    // Verify the chart loaded 
    cy.xpath('//*[contains(@class,"smartcharts") and contains(@class, "loading")]').should('exist')
    // Verify account remained logged in
    cy.get('.dc-btn').should('exist')
     
  })

})