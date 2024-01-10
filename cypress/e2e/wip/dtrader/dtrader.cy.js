import '@testing-library/cypress/add-commands'

describe('QATEST-5014, QATEST-5055 - Verify Main Page and Multipliers', () => {
  beforeEach(() => {
    cy.c_login()
  })

  it('should be able to switch between accounts', () => {

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

    //Trade Types
    cy.findByTestId('dt_contract_dropdown').click()
    cy.findByText('Options').click()
    cy.findByTestId('dt_contract_wrapper').findByText('Multipliers').click()
    cy.findByTestId('dt_contract_wrapper').findByPlaceholderText('Search').click({force: true})
    cy.findByTestId('dt_contract_wrapper').findByPlaceholderText('Search').type('mul')
    cy.findByTestId('dt_contract_item').findByText('Multipliers').should('be.visible')
    cy.get('#info-icon').click({force: true})

  })

  it('should be able to verify contract for Multipliers', () => {

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


})