import '@testing-library/cypress/add-commands'

describe('TRAH-2997 Verify the hyperlinks on Traders Hub', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub?lang=EN', 'large', 'check')
    //cy.c_rateLimit()
  })

  it('Should validate the hyperlinks in tradershub for EN', () => {
    cy.checkHyperLinks('EN')
  })
  it('Should validate the hyperlinks in tradershub for ES', () => {
    cy.checkLanguage('ES')
  })
  it('Should validate the hyperlinks in tradershub for BN', () => {
    cy.checkLanguage('BN')
  })
  it('Should validate the hyperlinks in tradershub for DE', () => {
    cy.checkLanguage('DE')
  })
  it('Should validate the hyperlinks in tradershub for KO', () => {
    cy.checkLanguage('KO')
  })
  it('Should validate the hyperlinks in tradershub for PT', () => {
    cy.checkLanguage('PT')
  })
  it('Should validate the hyperlinks in tradershub for PL', () => {
    cy.checkLanguage('PL')
  })
  it('Should validate the hyperlinks in tradershub for RU', () => {
    cy.checkLanguage('RU')
  })
  it('Should validate the hyperlinks in tradershub for FR', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.checkLanguage('FR')
  })
  it('Should validate the hyperlinks in tradershub for IT', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.checkLanguage('IT')
  })
  it('Should validate the hyperlinks in tradershub for TH', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.checkLanguage('TH')
  })
  it('Should validate the hyperlinks in tradershub for TR', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.checkLanguage('TR')
  })
  it('Should validate the hyperlinks in tradershub for VI', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.checkLanguage('VI')
  })
  it('Should validate the hyperlinks in tradershub for ZH_CN ', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.checkLanguage('ZHCN')
  })
  it('Should validate the hyperlinks in tradershub for ZH_TW', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.checkLanguage('ZHTW')
  })
})
