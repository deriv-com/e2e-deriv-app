import { derivApp } from '../../../support/locators'

const username = Cypress.env('credentials').production.masterUser.ID
const password = Cypress.env('credentials').production.masterUser.PSWD
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
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
      //Verify home page has successfully loaded
      if (isMobile) {
        cy.c_skipPasskeysV2()
        cy.findByRole('button', { name: 'Cashier' }).should('be.visible')
      } else cy.findByTitle('Cashier').should('be.visible')
      cy.findByText('Join over 2.5 million traders').should('not.exist')
      cy.findByRole('button', { name: 'Log in' }).should('not.exist')
      cy.findByRole('button', { name: 'Sign up' }).should('not.exist')
      cy.findByRole('button', { name: 'Get Started' }).should('not.exist')
      cy.c_checkTradersHubHomePage(isMobile)
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
      cy.findByText('Join over 2.5 million traders').should('be.visible')
      cy.findByRole('button', { name: 'Log in' }).should('be.visible')
      cy.findByRole('button', { name: 'Sign up' }).should('be.visible')
      cy.findByRole('button', { name: 'Get Started' }).should('be.visible')
      if (isMobile)
        cy.findByRole('button', { name: 'Cashier' }).should('not.exist')
      else cy.findByTitle('Cashier').should('not.exist')
      cy.url().should('eq', Cypress.config('baseUrl'))
    })
  })
})
