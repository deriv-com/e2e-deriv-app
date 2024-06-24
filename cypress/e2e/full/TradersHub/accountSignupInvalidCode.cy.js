import { generateEpoch } from '../../../support/helper/utility'

describe('QATEST-5547: Verify signup with invalid verification code', () => {
  const size = ['small', 'desktop']
  let country = Cypress.env('countries').CO

  size.forEach((size) => {
    it(`Verify user cant proceed to signup with invalid verification code on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const signUpEmail = `sanity${generateEpoch()}invl@deriv.com`
      cy.c_setEndpoint(signUpEmail, size)
      cy.c_emailVerification('account_opening_new.html', signUpEmail)
      cy.then(() => {
        cy.c_visitResponsive('https://deriv.com/signup-success/')
        cy.findByText(new RegExp(signUpEmail)).should('be.visible')
        cy.findByRole('link', {
          name: `Didn't receive your email?`,
        }).click()
        cy.findByText(
          `If you don't see an email from us within a few minutes, a few things could have happened:`
        ).should('be.visible')
        cy.findByRole('link', {
          name: 'Re-enter your email and try again',
        }).click()
        cy.c_setEndpoint(signUpEmail, size)
        cy.c_visitResponsive(Cypress.env('verificationUrl'), size).then(() => {
          cy.window().then((win) => {
            win.localStorage.setItem(
              'config.server_url',
              Cypress.env('stdConfigServer')
            )
            win.localStorage.setItem(
              'config.app_id',
              Cypress.env('stdConfigAppId')
            )
          })
        })
        cy.get('h1').contains('Select your country and').should('be.visible')
        cy.c_selectCountryOfResidence(country)
        cy.c_selectCitizenship(country)
        cy.c_enterPassword()
        cy.findByText('Your token has expired or is invalid.').should(
          'be.visible'
        )
        cy.findByRole('button', {
          name: 'Cancel',
        }).should('be.enabled')
        cy.findByRole('button', {
          name: 'Create new account',
        }).should('be.enabled')
        cy.c_visitResponsive('/', size)
        cy.c_uiLogin(
          size,
          signUpEmail,
          Cypress.env('credentials').test.masterUser.PSWD
        )
        cy.findByText(
          `Your email and/or password is incorrect. Perhaps you signed up with a social account?`
        ).should('be.visible')
      })
    })
  })
})
