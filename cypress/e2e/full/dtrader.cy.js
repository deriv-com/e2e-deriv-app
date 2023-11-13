import '@testing-library/cypress/add-commands'

describe('QATEST-5014 - Verify Main Page', () => {
  beforeEach(() => {
    cy.c_login()
  })

  it('Account switcher / Markets menu / Trade Types', () => {

    //Account switcher
    cy.findByTestId('dt_acc_info').click()
    cy.get('#dt_core_account-switcher_demo-tab').click()
    cy.findByTestId('acc-switcher').findByText('Real').click()
    cy.get('#dt_core_account-switcher_demo-tab').click()

    //Markets
    cy.get('.cq-symbol-select-btn').click()
    cy.findByText('Baskets', { exact: true }).click()
    cy.findByText('Commodities Basket', { exact: true }).should('be.visible')
    cy.findByText('Forex Basket', { exact: true }).should('be.visible')
    cy.get('.sc-mcd__category__content--commodities-basket > .subcategory > a > .ic-icon').should('be.visible') //Cypress multiple tabs support issue
    //TODO - Playwright task for this?

    //Trade Types
    cy.findByTestId('dt_contract_dropdown').click()
    cy.findByText('Options').click()
    cy.findByTestId('dt_contract_wrapper').findByText('Multipliers').click()
    cy.findByTestId('dt_contract_wrapper').findByPlaceholderText('Search').click({force: true})
    cy.findByTestId('dt_contract_wrapper').findByPlaceholderText('Search').type('mul')
    cy.findByTestId('dt_contract_item').findByText('Multipliers').should('be.visible')
    cy.get('#info-icon').click({force: true})
    //cy.findByText('Use multipliers to leverage your potential returns. Predict if the asset price w').should('exist')

  })

  it('QATEST-5055 - Verify contract for Multipliers', () => {

    cy.findByTestId('dt_acc_info').click()
    cy.get('#dt_core_account-switcher_demo-tab').click()
    cy.get('.acc-switcher__id > :nth-child(2)')

    //Stake
    
    cy.findByTestId('dt_contract_dropdown').click({force: true})
    cy.get('#dt_contract_multiplier_item').click({force: true})
    cy.findByRole('button', { name: 'Up 10.00 USD' }).should('exist')
    cy.findByRole('button', { name: 'Down 10.00 USD' }).should('exist')
    cy.findByLabelText('Increment value').click()
    cy.findByRole('button', { name: 'Up 11.00 USD' }).should('exist')
    cy.findByRole('button', { name: 'Down 11.00 USD' }).should('exist')
    cy.findByLabelText('Decrement value').click()
    cy.findByLabelText('Decrement value').click()
    cy.findByRole('button', { name: 'Up 9.00 USD' }).should('exist')
    cy.findByRole('button', { name: 'Down 9.00 USD' }).should('exist')

  });

  // it('Demo and Real Account Switcher', () => {

  //   cy.c_login()

  //   cy.findByTestId('dt_contract_dropdown').findByText('Rise/Fall').click()
  //   cy.findByTestId('dt_contract_wrapper').findByText('Higher/Lower').click()
  //   cy.findByText('5 Ticks', { exact: true }).click()
  //   cy.findByLabelText('Toggle between advanced and simple duration settings').click()
  //   cy.findByRole('button', { name: 'Payout' }).click()
  //   cy.findByRole('button', { name: 'End time' }).click()
  
  // })

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