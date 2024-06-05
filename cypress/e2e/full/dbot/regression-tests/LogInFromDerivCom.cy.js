import '@testing-library/cypress/add-commands'
import BotDashboard from '../../../../support/pageobjects/dbot/bot_dashboard_page'

describe('QATEST-4126: Log in Deriv Bot platform page from deriv.com', () => {
  const botDashboard = new BotDashboard()
  beforeEach(() => {
    cy.c_visitResponsive(`${Cypress.env('derivComProdURL')}/dbot`, 'desktop')
    cy.findByText('Get into the Deriv Bot experience').should('exist')
  })

  it('Login from deriv.com and redirect to dbot on app.deriv.com', () => {
    if (Cypress.config().baseUrl == Cypress.env('prodURL')) {
      // added an if here so later can add on for staging check
      cy.findByRole('button', { name: 'whatsapp icon' }).should('be.visible')
      cy.findByRole('button', { name: 'Log in' }).click({ force: true })
      cy.findByLabelText('Email').type(
        Cypress.env('credentials').production.dBot.ID
      )
      cy.findByLabelText('Password').type(
        Cypress.env('credentials').production.dBot.PSWD
      )
      cy.findByRole('button', { name: 'Log in' }).click()
      botDashboard.botBuilderDash.should('be.visible')
      cy.c_visitResponsive(`${Cypress.env('derivComProdURL')}dbot`, 'desktop')
      cy.findByText('Go to live demo')
        .invoke('attr', 'href')
        .then((href) => {
          cy.request(href).its('status').should('eq', 200)
        })
    }
  })
})
