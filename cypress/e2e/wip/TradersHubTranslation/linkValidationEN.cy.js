import '@testing-library/cypress/add-commands'

describe('TRAH-2997 Verify the hyperlinks on Traders Hub', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub?lang=EN', 'large', 'check')
  })

  it('Should validate the hyperlinks in tradershub for EN', () => {
    cy.checkLanguage('EN')
  })
})
