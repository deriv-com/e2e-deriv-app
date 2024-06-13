import '@testing-library/cypress/add-commands'
import { derivApp } from '../../../support/locators'

const username = Cypress.env('passkeyLoginEmail')
const password = Cypress.env('passkeyPassword')
const size = ['small', 'desktop']

describe('QATEST-155377 - Passkey option under Account settings check ', () => {
  const size = ['small', 'desktop']

  size.forEach((size) => {
    it('Should contain Passkeys option in Mobile Responsive and Should not contain on Desktop Version under Account settings', () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive(Cypress.env('passkeyUrl') + 'endpoint', size)

      cy.findByLabelText('Server').click().clear()
      cy.findByLabelText('Server').type('qa141.deriv.dev')
      cy.findByLabelText('OAuth App ID').click().clear()
      cy.findByLabelText('OAuth App ID').type('1011')
      cy.findByRole('button', { name: 'Submit' }).click()

      //cy.contains('Log in').click();
      cy.c_visitResponsive(
        Cypress.env('passkeyUrl') +
          'oauth2/authorize?app_id=' +
          Cypress.env('passkeyAppId'),
        size
      )
      // cy.c_login()
      //cy.c_visitResponsive('/', size)
      cy.findByRole('button', { name: 'Log in' }).click()
      cy.findByLabelText('Email').type(username)
      cy.findByLabelText('Password').type(password, { log: false })
      cy.findByRole('button', { name: 'Log in' }).click()
      cy.log('after login button click')

      //Wait for page to load
      //cy.c_uiLogin(size)
      //Verify home page has successfully loaded
      // cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')

      if (isMobile) {
        cy.log('inside mobile ')
        cy.c_waitUntilElementIsFound({
          cyLocator: () =>
            cy.get('.dc-text.main-title-bar__text').should('be.visible'),
          timeout: 3000,
          maxRetries: 5,
        })
        cy.c_skipPasskeysV2()
        //cy.get('#effortless_modal_root').should('contain.text', 'Maybe later').click().wait(1000)
        derivApp.commonPage.mobileLocators.header.hamburgerMenuButton().click()
        derivApp.commonPage.mobileLocators.sideMenu
          .sidePanel()
          .findByText('Account Settings')
          .click()
          .wait(1000)
        derivApp.commonPage.mobileLocators.sideMenu
          .sidePanel()
          .findByText('Passkeys')
          .click()

        // cy.get('#dt_mobile_drawer').should('contain.text', 'PasskeysNEW!').should('be.visible').click()

        //Verify the 'Experience safer logins' screen
        cy.c_waitUntilElementIsFound({
          cyLocator: () =>
            cy
              .findByTestId('dt_div_100_vh')
              .should('contain.text', 'Experience safer logins'),
          timeout: 5000,
          maxRetries: 5,
        })
        cy.get('#app_contents')
          .should('contain.text', 'Passkeys')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'Experience safer logins')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'Enhanced security is just a tap away.')
          .should('be.visible')
        cy.findByTestId('form-footer-container')
          .should('contain.text', 'Create passkey')
          .should('be.visible')
        cy.get('.dc-btn--secondary').should('be.visible').click()

        //Verify the 'Learn More' screen
        cy.c_waitUntilElementIsFound({
          cyLocator: () =>
            cy
              .findByTestId('dt_div_100_vh')
              .should('contain.text', 'Effortless login with passkeys'),
          timeout: 5000,
          maxRetries: 5,
        })
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'What are passkeys?')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'Secure alternative to passwords.')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should(
            'contain.text',
            'Unlock your account like your phone - with biometrics, face scan or PIN.'
          )
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'Why passkeys?')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'Extra security layer')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should(
            'contain.text',
            'Shields against unauthorised access and phishing.'
          )
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'How to create a passkey?')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'Go to ‘Account Settings’ on Deriv.')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'You can create one passkey per device.')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'Where are passkeys saved?')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'Android: Google password manager.')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'iOS: iCloud keychain.')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should(
            'contain.text',
            'What happens if my Deriv account email is changed?'
          )
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'No problem! Your passkey still works.')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should(
            'contain.text',
            'Sign in to Deriv with your existing passkey.'
          )
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'Before using passkey:')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'Enable screen lock on your device.')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'Sign in to your Google or iCloud account.')
          .should('be.visible')
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'Enable Bluetooth.')
          .should('be.visible')

        cy.findByRole('button', { name: 'Create passkey' })
          .should('be.visible')
          .click()
        cy.get('#modal_root')
          .should('contain.text', 'Just a reminder')
          .should('be.visible')
        cy.get('#modal_root')
          .should('contain.text', 'Enable screen lock on your device.')
          .should('be.visible')
        cy.get('#modal_root')
          .should('contain.text', 'Enable bluetooth.')
          .should('be.visible')
        cy.get('#modal_root')
          .should('contain.text', 'Sign in to your Google or iCloud account.')
          .should('be.visible')
        cy.get('[data-testid="dt_modal_footer"] button')
          .should('contain.text', 'Continue')
          .should('be.visible')
        cy.get('.dc-modal-header__close').click()
        cy.get('.passkeys-status__description-back-button').click() // <- back icon

        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'Experience safer logins')
          .should('be.visible')
        cy.findByRole('button', { name: 'Create passkey' })
          .should('be.visible')
          .click()
        cy.get('#modal_root')
          .should('contain.text', 'Just a reminder')
          .should('be.visible')
        cy.get('#modal_root')
          .should('contain.text', 'Enable screen lock on your device.')
          .should('be.visible')
        cy.get('#modal_root')
          .should('contain.text', 'Enable bluetooth.')
          .should('be.visible')
        cy.get('#modal_root')
          .should('contain.text', 'Sign in to your Google or iCloud account.')
          .should('be.visible')
        cy.get('[data-testid="dt_modal_footer"] button')
          .should('contain.text', 'Continue')
          .should('be.visible')
        cy.get('.dc-modal-header__close').click()
        cy.get('.dc-page-overlay__header-close').click() // 'X' icon
      } else {
        // Verify 'Passkey (New)' option should not available under Security and safety menu for desktop
        cy.get('a[href="/account/personal-details"]').click()
        cy.get('a#btnPasskeys.button.passkey-btn').should('not.exist')
        cy.log('inside Desktop')
      }
    })
  })
})
