import '@testing-library/cypress/add-commands'

describe('TRAH-2997 Verify the hyperlinks on Traders Hub', () => {
  beforeEach(() => {
    cy.c_login()
  })

  it('Should validate the hyperlinks in tradershub in all languages', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.checkAllLanguages()
  })
})
