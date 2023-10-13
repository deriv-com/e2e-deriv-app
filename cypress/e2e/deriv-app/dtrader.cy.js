import '@testing-library/cypress/add-commands'

describe('Deriv Trader', () => {
  beforeEach(() => {
    cy.c_visitResponsive('/dtrader', 'large')
    cy.findByLabelText('Login').click()
    cy.c_login()
  })

  it('Markets menu', () => {

    cy.findByText('Baskets', { exact: true }).click({ force: true })
    cy.findByText('AUD Basket', { exact: true }).click({ force: true })

  })

  it('Rise and Fall Options', () => {

    cy.findByRole('button', { name: 'Minutes' }).click()
    cy.findByRole('button', { name: 'Ticks' }).click()
    cy.findByRole('button', { name: 'Payout' }).click()
    cy.findByRole('button', { name: 'Stake' }).click()

  })

  it('Change Language', () => {

    cy.findByTestId('dt_toggle_language_settings').click()
    cy.findByText('Español').click()
    cy.findByTestId('dt_toggle_language_settings', { force: true }).click()
    cy.findByRole('heading', { name: 'Seleccionar idioma' }).click()
    cy.findByText('English').click()

  });

})