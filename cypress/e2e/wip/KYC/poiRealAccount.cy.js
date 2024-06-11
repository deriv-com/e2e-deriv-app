import '@testing-library/cypress/add-commands'
import {
  generateRandomName,
  generateAccountNumberString,
} from '../../../support/helper/utility'

describe('QATEST-149355 POI through real account creation', () => {
  beforeEach(() => {
    // cy.c_visitResponsive('/', 'small')
    // cy.c_createDemoAccount('gh')
    cy.c_login()
    cy.findByTestId('dt_traders_hub').should('be.visible')
  })

  it('Should submit IDV POI successfully', () => {
    cy.contains("Trader's Hub").should('be.visible')
    // Choose currency
    cy.findByTestId('dt_dropdown_display').click()
    cy.findAllByTestId('dti_list_item').contains('Real').click({ force: true })
    cy.findByText('US Dollar').should('exist').click()

    cy.findByRole('button', { name: /Next/i }).click()
    // Identity verification
    // cy.contains('Identity verification').should('be.visible')
    // cy.get('select[name="document_type"]').select('Passport')
    // cy.findByLabelText('Enter your document number').type('G0000001')
    // cy.findByTestId('first_name').clear().type(`Joe ${generateRandomName()}`)
    // cy.findByTestId('last_name').clear().type('Leo')
    // cy.findByTestId('date_of_birth').type('2000-09-20')
    // cy.get('.dc-checkbox__box').click()
    // cy.findByTestId('phone').clear().type(generateAccountNumberString(9))
    // cy.findByTestId('place_of_birth').select('Ghana')
    // cy.findByTestId('dt_dropdown_container').click()
    // cy.contains('Hedging').click()

    // cy.findByRole('button', { name: /Next/i }).click()
    // // Address submission
    // cy.get('input[name="address_line_1"]').type(generateRandomName())
    // cy.get('input[name="address_city"]').type(generateRandomName())

    // cy.findByRole('button', { name: /Next/i }).click()
    // // TnC
    // cy.findByTestId('dt_dropdown_display').click()
    // cy.contains('Yes').click()
    // cy.findByLabelText('agreed_tos').check()
    // cy.findByLabelText('agreed_tnc').check()

    // cy.findByRole('button', { name: /Add account/i }).click()
  })
})
