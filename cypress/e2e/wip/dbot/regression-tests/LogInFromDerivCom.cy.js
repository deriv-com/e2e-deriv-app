import '@testing-library/cypress/add-commands'

describe('QATEST-4126: Log in Deriv Bot platform page from deriv.com', () => {
  beforeEach(() => {
    cy.c_visitResponsive('https://deriv.com', 'dektop')
    cy.findByRole('link', { name: 'Learn more About Deriv Bot' }).click()
    cy.findByRole('img', { name: 'Deriv Bot' }).should('be.visible')
  })

  it('Login from deriv.com and redirect to dbot on app.deriv.com', () => {
    if (Cypress.config().baseUrl == Cypress.env('prodURL')) {
      // added an if here so later can add on for staging check
      cy.wait(3000)
      cy.findByRole('button', { name: 'Log in' }).click({ force: true })
      cy.get('input[id="txtEmail"]')
        .click()
        .type(Cypress.env('credentials').production.dBot.ID)
      cy.get('input[id="txtPass"]')
        .click()
        .type(Cypress.env('credentials').production.dBot.PSWD)
    }
    cy.findByRole('button', { name: 'Log in' })
      .invoke('attr', 'target', '_self')
      .click()
    cy.c_skipTour()
  })

  it('Go to dbot by choosing go to live demo', () => {
    cy.findAllByText('Go to live demo')
      .invoke('attr', 'target', '_self')
      .click()
    cy.c_skipTour()
  })
})
