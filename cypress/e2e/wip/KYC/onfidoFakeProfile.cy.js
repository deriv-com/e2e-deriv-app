import { generateFakeProfileName } from '../../../support/helper/utility'

const BO_URL = `https://${Cypress.env('configServer')}${Cypress.env('qaBOEndpoint')}`
describe('QATEST-4777 Onfido fake profile.', () => {
  beforeEach(() => {
    cy.c_createRealAccount('co')
    cy.c_login()
  })
  it('Should show unwelcome login ID in BO.', () => {
    cy.c_visitResponsive('/account/personal-details', 'small')
    cy.findByTestId('dt_first_name').clear().type(generateFakeProfileName())
    cy.findByTestId('dt_last_name').clear().type(generateFakeProfileName())
    cy.findByRole('button', { name: 'Submit' }).click()
    /* Access BO */
    cy.c_visitResponsive('/', 'large')
    cy.visit(BO_URL)
    cy.findByText('Please login.').click()
    cy.findByText('Client Management').click()
    cy.findByPlaceholderText('email@domain.com')
      .should('exist')
      .clear()
      .type(Cypress.env('credentials').test.masterUser.ID)
    cy.findByRole('button', { name: /View \/ Edit/i }).click()
    cy.get('.link').eq(1).should('be.visible').click()
    cy.contains('Unwelcome Login ID (no deposits or trades)').should(
      'be.visible'
    )
    cy.contains('fake profile info - pending POI').should('be.visible')
  })
})
