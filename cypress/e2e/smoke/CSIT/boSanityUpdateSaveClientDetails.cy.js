import { generateRandomName } from '../../../support/helper/loginUtility'

const firstName = generateRandomName(5)
const lastName = generateRandomName(7)

describe('QATEST-115357 - BO General Sanity - Update/Save client details', () => {
  beforeEach(() => {
    cy.c_visitResponsive('/')
    cy.c_createCRAccount()
    cy.c_login()
  })

  it('should login, set self exclusion and verify its applied ', () => {
    /* Visits BO */
    cy.c_visitBackOffice()
    cy.findByText('Client Management').click()
    cy.findByPlaceholderText('email@domain.com')
      .should('exist')
      .clear()
      .type(Cypress.env('credentials').test.masterUser.ID)
    cy.findByRole('button', { name: /View \/ Edit/i }).click()
    cy.get('.link').eq(1).should('be.visible').click()
    cy.findByRole('link', { name: 'Client details' }).click()
    cy.get('[name="first_name"]').clear().type(firstName)
    cy.get('[name="last_name"]').clear().type(lastName)
    cy.get('input[value="Save client details"]').first().click()

    /* Verifies changes are reflected on FE side - desktop */
    cy.c_login()
    cy.c_visitResponsive('/account/personal-details', 'large')
    cy.findByTestId('dt_first_name').should('contain.value', firstName)
    cy.findByTestId('dt_last_name').should('contain.value', lastName)

    /* Verifies changes are reflected on FE side - mobile */
    cy.c_visitResponsive('/account/personal-details', 'small')
    cy.findByTestId('dt_first_name').should('contain.value', firstName)
    cy.findByTestId('dt_last_name').should('contain.value', lastName)
  })
})
