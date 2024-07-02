import { generateRandomName } from '../../../support/helper/utility'

describe('QATEST-23042 IDV DOB Mismatch by Smile Identity provider', () => {
  beforeEach(() => {
    cy.c_createCRAccount({ country_code: 'ke' })
    cy.c_login()
    cy.findByTestId('dt_traders_hub').should('be.visible')
    cy.c_navigateToPoiResponsive('Kenya')
  })

  it('Should return Date of birth mismatch', () => {
    cy.get('select[name="document_type"]').select('National ID Number')
    cy.findByLabelText('Enter your document number').type('00000000')
    cy.findByTestId('first_name').clear().type('Doe Joe')
    cy.findByTestId('last_name').clear().type(`Leo ${generateRandomName()}`)
    cy.findByTestId('date_of_birth').type('1991-08-23')

    cy.findByRole('button', { name: 'Verify' }).should('be.disabled')
    cy.get('.dc-checkbox__box').click()
    cy.findByRole('button', { name: 'Verify' }).should('be.enabled').click()
    cy.findByText('Your documents were submitted successfully').should(
      'be.visible'
    )
    cy.findByText('Proof of address required', { timeout: 30000 }).should(
      'be.visible'
    )
    cy.c_closeNotificationHeader()
    cy.reload()
    cy.findByText('Your identity verification failed because:').should(
      'be.visible'
    )
    cy.findByTestId('DobMismatch')
      .contains(
        "The date of birth on your identity document doesn't match your profile."
      )
      .should('be.visible')
  })
})
