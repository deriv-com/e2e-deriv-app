import '@testing-library/cypress/add-commands'

describe('Deriv Trader', () => {
  beforeEach(() => {
    cy.c_login()
    cy.findAllByRole('button', { name: 'Open' }).first().click()
  })

  it('Markets menu', () => {

    cy.findByText('Baskets', { exact: true }).click({ force: true })
    cy.findByText('AUD Basket', { exact: true }).click({ force: true })

  })

  it('Demo and Real Account Switcher', () => {

    cy.c_login()

    cy.findByTestId('dt_contract_dropdown').findByText('Rise/Fall').click()
    cy.findByTestId('dt_contract_wrapper').findByText('Higher/Lower').click()
    cy.findByText('5 Ticks', { exact: true }).click()
    cy.findByLabelText('Toggle between advanced and simple duration settings').click()
    cy.findByRole('button', { name: 'Payout' }).click()
    cy.findByRole('button', { name: 'End time' }).click()
  
  })

  // it('Rise and Fall Options', () => {

  //   cy.findByRole('button', { name: 'Minutes' }).click()
  //   cy.findByRole('button', { name: 'Ticks' }).click()
  //   cy.findByRole('button', { name: 'Payout' }).click()
  //   cy.findByRole('button', { name: 'Stake' }).click()

  // })

  // it('Change Language', () => {

  //   cy.findByTestId('dt_toggle_language_settings').click()
  //   cy.findByText('Español').click()
  //   cy.findByTestId('dt_toggle_language_settings', { force: true }).click()
  //   cy.findByRole('heading', { name: 'Seleccionar idioma' }).click()
  //   cy.findByText('English').click()

  // });

})