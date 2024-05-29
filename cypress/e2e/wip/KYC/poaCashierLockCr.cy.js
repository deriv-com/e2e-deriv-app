import '@testing-library/cypress/add-commands'

const boURL = `https://${Cypress.env('configServer')}/d/backoffice/login.cgi`

describe('QATEST-4882 Types of cashier lock when POA expired', () => {
  beforeEach(() => {
    cy.c_visitResponsive('/')
    cy.c_createRealAccount('co')
    cy.c_login()
    cy.c_navigateToPoaResponsive()
  })

  it('No cashier lock', () => {
    cy.get('.dc-file-dropzone__content').click()
    cy.get('input[type=file]').selectFile(
      'cypress/fixtures/kyc/testDriversLicense.jpeg',
      { force: true }
    )
    cy.c_closeNotificationHeader()
    cy.get('.dc-btn').click()
    cy.c_closeNotificationHeader()
    cy.contains('Your documents were submitted successfully').should(
      'be.visible'
    )
    cy.c_visitResponsive('/', 'large')
    cy.visit(boURL)
    cy.findByText('Please login.').click()
    cy.findByText('Client Management').click()
    cy.findByPlaceholderText('email@domain.com')
      .should('exist')
      .clear()
      .type(Cypress.env('credentials').test.masterUser.ID)
    cy.findByRole('button', { name: /View \/ Edit/i }).click()
    cy.get('.link').eq(1).should('be.visible').click()
  })
})
