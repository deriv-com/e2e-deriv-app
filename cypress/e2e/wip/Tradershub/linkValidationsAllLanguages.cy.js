import '@testing-library/cypress/add-commands'

describe('TRAH-2997 Verify the hyperlinks on Traders Hub', () => {
  beforeEach(() => {
    cy.c_login()
  })

  it('Should validate the hyperlinks in tradershub for english and spanish', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    /*cy.checkHyperLinks('EN')
    cy.findAllByTestId('dt_icon').eq(0).click()
    cy.findByText('Select Language').should('be.visible')
    cy.findAllByTestId('dt_settings_language_button').eq(0).click()
    cy.c_rateLimit()
    cy.findByText('Cajero').should('be.visible')
    cy.checkHyperLinks('ES')
    cy.findAllByTestId('dt_icon').eq(1).click()
    cy.findByText('Select Language').should('be.visible')
    cy.findAllByTestId('dt_settings_language_button').eq(0).click()
    cy.c_rateLimit()
    cy.findByText('abcdf').should('be.visible')
    cy.checkHyperLinks('DE')
    cy.findAllByTestId('dt_icon').eq(2).click()
    cy.findByText('Select Language').should('be.visible')
    cy.findAllByTestId('dt_settings_language_button').eq(0).click()
    cy.c_rateLimit()
    cy.findByText('fsdfs').should('be.visible')
    cy.checkHyperLinks('BO')*/
    cy.checkAllLanguages()
  })
})
