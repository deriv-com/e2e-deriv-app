import { generateRandomName } from '../../../support/helper/utility'

describe('QATEST-23076 IDV Underage', () => {
  // Note you will need to add QA provider to qabox
  beforeEach(() => {
    cy.c_visitResponsive('small')
    cy.c_createCRAccount({ country_code: 'gh' })
    cy.c_login()
    cy.c_navigateToPoiResponsive('Republic of QA')
  })

  it('Should not verify due to underage client', () => {
    cy.get('select[name="document_type"]').select('Passport')
    cy.findByLabelText('Enter your document number').type('12345678')
    cy.findByTestId('first_name').clear().type('Refuted')
    cy.findByTestId('last_name')
      .clear()
      .type(`Underage ${generateRandomName()}`)
    cy.findByTestId('date_of_birth').type('2004-09-20')
    cy.get('.dc-checkbox__box').click()
    cy.findByRole('button', { name: 'Verify' }).click()
    cy.contains('Your documents were submitted successfully').should(
      'be.visible'
    )
    cy.findByText('Proof of address required', { timeout: 30000 }).should(
      'exist'
    )

    cy.c_closeNotificationHeader()
    cy.reload()
    cy.contains(
      'We were unable to verify the identity document with the details provided.'
    ).should('be.visible')
  })
})
