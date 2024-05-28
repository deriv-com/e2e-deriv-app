import '@testing-library/cypress/add-commands'

describe('QATEST-4835 POA Reject', () => {
  beforeEach(() => {
    cy.c_visitResponsive('/')
    cy.c_createRealAccount('gh')
    cy.c_login()
    cy.c_navigateToPoiResponsive('Ghana')
  })

  it('Should return Date of birth mismatch', () => {})
})
