import '@testing-library/cypress/add-commands'
import { derivApp } from '../../../support/locators'

const username = Cypress.env('loginEmailProd')
const password = Cypress.env('loginPasswordProd')
const size = ['small', 'desktop']

describe('QATEST-103970: Verify user can successfully login and logout', () => {
  size.forEach((size) => {
    it(`I should be able to successfully login and logout from deriv app on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('/', size)
      cy.findByRole('button', { name: 'Log in' }).click()
      cy.findByLabelText('Email').type(username)
      cy.findByLabelText('Password').type(password, { log: false })
      cy.findByRole('button', { name: 'Log in' }).click()
      //Verify home page has successfully loaded
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
      if (isMobile) cy.c_skipPasskeysV2()
      //Logout
      if (isMobile) {
        derivApp.commonPage.mobileLocators.header.hamburgerMenuButton().click()
        derivApp.commonPage.mobileLocators.sideMenu
          .sidePanel()
          .findByText('Log out')
          .click()
      } else {
        cy.get('.traders-hub-header__setting').click()
        cy.findByTestId('dt_logout_tab').click()
      }
      cy.findByText('Trading for anyone. Anywhere. Anytime.').should(
        'be.visible'
      )
      cy.url().should('eq', Cypress.env('derivComProdURL'))
    })
  })
})
