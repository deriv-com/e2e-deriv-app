import { derivApp } from '../../../support/locators'

describe(`QATEST-00001 - fiat withdrawal request for screen size: small`, () => {
  beforeEach(() => {
    cy.c_setServerUrlAndAppId(
      Cypress.env('configServer'),
      Cypress.env('configAppId')
    )
    cy.c_login()
    cy.c_visitResponsive('/cashier/withdrawal', 'small')
    cy.c_waitForLoader()
  })
  it('should make a Fiat withdrawal request', () => {
    cy.c_verifycontentWithdrawalPage('beforeRequest')
    derivApp.cashierPage.withdrawal.sendEmailButton().click()
    cy.c_verifycontentWithdrawalPage('afterRequest')
  })
})

describe(`QATEST-00001 - fiat withdrawal request for screen size: large`, () => {
  beforeEach(() => {
    cy.c_setServerUrlAndAppId(
      Cypress.env('configServer'),
      Cypress.env('configAppId')
    )
    cy.c_login()
    cy.c_visitResponsive('/cashier/withdrawal', 'large')
    cy.c_waitForLoader()
  })
  it('should make a Fiat withdrawal request', () => {
    cy.c_verifycontentWithdrawalPage('beforeRequest')
    derivApp.cashierPage.withdrawal.sendEmailButton().click()
    cy.c_verifycontentWithdrawalPage('afterRequest')
  })
})
