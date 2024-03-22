import '@testing-library/cypress/add-commands'

const username = Cypress.env('loginEmailProd')
const password = Cypress.env('loginPasswordProd')

describe('Verify deriv app login', () => {
  it('QATEST-103970: I should be able to successfully login and logout from deriv app', () => {
    cy.c_visitResponsive('/', 'large')
    cy.findByRole('button', { name: 'Log in' }).click()
    cy.findByLabelText('Email').type(username)
    cy.findByLabelText('Password').type(password, { log: false })
    cy.findByRole('button', { name: 'Log in' }).click()
    //Verify home page has successfully loaded
    cy.findByTestId('dt_div_100_vh')
      .findByTestId('dt_popover_wrapper')
      .findByTestId('dt_balance_text_container')
      .should('be.visible', {
        timeout: 30000,
      })
    //Logout
    cy.get('.traders-hub-header__setting').click()
    cy.findByTestId('dt_logout_tab').click()
    //Verify new page has successfully loaded
    cy.findByRole('button', { name: 'whatsapp icon' }).should('be.visible', {
      timeout: 30000,
    })
    cy.url().should('eq', Cypress.env('derivComProdURL'))
  })
})
