import '@testing-library/cypress/add-commands'
import {
  generateRandomName,
  generateAccountNumberString,
} from '../../../support/helper/utility'

describe('QATEST-149355 POI through real account creation', () => {
  beforeEach(() => {
    cy.c_createDemoAccount('gh')
    cy.c_login()
    cy.viewport('iphone-xr')
  })

  it('Should submit IDV POI successfully', () => {
    cy.contains("Trader's Hub").should('be.visible')

    // Choose currency
    cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
    cy.findByTestId('dt_dropdown_display').click()
    cy.findAllByTestId('dti_list_item').contains('Real').click({ force: true })
    cy.findByText('US Dollar').should('exist').click()
    cy.findByRole('button', { name: /Next/i }).click()

    // Identity verification
    cy.contains('Identity verification').should('be.visible')
    cy.get('select[name="document_type"]').select('Passport')
    cy.findByLabelText('Enter your document number').type('G0000001')
    cy.findByTestId('first_name').clear().type(`Joe ${generateRandomName()}`)
    cy.findByTestId('last_name').clear().type('Leo')
    cy.findByTestId('date_of_birth').type('2000-09-20')
    cy.get('.dc-checkbox__box').click()
    cy.findByTestId('phone').clear().type(generateAccountNumberString(9))
    cy.findByTestId('place_of_birth_mobile').select('Ghana')
    cy.findByTestId('account_opening_reason_mobile').select('Hedging')
    cy.findByRole('button', { name: /Next/i }).click()

    // Address submission
    cy.get('input[name="address_line_1"]').type(generateRandomName())
    cy.get('input[name="address_city"]').type(generateRandomName())
    cy.findByRole('button', { name: /Next/i }).click()

    // T&C acceptance
    cy.get('.fatca-declaration__agreement').click()
    cy.findAllByTestId('dti_list_item').eq(0).click()
    cy.get('.dc-checkbox__box').click({ multiple: true })
    cy.findByRole('button', { name: /Add account/i }).click()
    // Close the success popup
    cy.findByRole('button', { name: /Maybe later/i }).click()

    // Go to POI and Make assertions
    cy.get('#dt_mobile_drawer_toggle').click()
    cy.contains('Account Settings').click()
    cy.contains('Proof of identity').click()
    cy.c_closeNotificationHeader()
    cy.findByText(
      'We were unable to verify the identity document with the details provided.'
    ).should('be.visible')
  })
})
