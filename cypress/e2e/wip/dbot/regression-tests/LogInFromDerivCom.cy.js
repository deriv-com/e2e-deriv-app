import '@testing-library/cypress/add-commands'

describe('QATEST-4126: Log in Deriv Bot platform page from deriv.com', () => {
  beforeEach(() => {
    if (Cypress.config().baseUrl != Cypress.env('prodURL')) {
      cy.on('window:before:load', (win) => {
        win.localStorage.setItem(
          'config.server_url',
          Cypress.env('configServer')
        )
        win.localStorage.setItem('config.app_id', Cypress.env('configAppId'))
      })
    }
    cy.visit('https://deriv.com')
    cy.findByRole('link', { name: 'Learn more About Deriv Bot' }).click()
    cy.findByRole('img', { name: 'Deriv Bot' }).should('be.visible')
    setTimeout(() => {
      cy.findByRole('button', { name: 'Log in' }).click({ force: true })
    }, 5000)
  })

  it('Login from deriv.com and redirect to dbot on app.deriv.com', () => {
    if (Cypress.config().baseUrl === Cypress.env('prodURL')) {
      cy.get('input[id="txtEmail"]')
        .click()
        .type(Cypress.env('credentials').production.dBot.ID)
      cy.get('input[id="txtPass"]')
        .click()
        .type(Cypress.env('credentials').production.dBot.PSWD)
    } else {
      cy.get('input[id="txtEmail"]')
        .click()
        .type(Cypress.env('credentials').test.dBot.ID)
      cy.get('input[id="txtPass"]')
        .click()
        .type(Cypress.env('credentials').test.dBot.PSWD)
    }
    cy.findByRole('button', { name: 'Log in' }).click({ force: true })
    cy.wait(12000)
  })
})
