import '@testing-library/cypress/add-commands'

describe('TRAH-2997 Verify the hyperlinks on Traders Hub', () => {
  beforeEach(() => {
    cy.c_visitResponsive('/')
    cy.c_createRealAccount()
    cy.c_login()
    cy.findByTestId('dt_traders_hub_home_button').click()
  })

  it('Should validate the hyperlinks in tradershub for TH', () => {
    cy.checkLanguage('TH')
  })
})
