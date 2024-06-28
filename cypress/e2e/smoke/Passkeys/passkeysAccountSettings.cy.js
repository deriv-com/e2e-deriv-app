import { derivApp } from '../../../support/locators'

const size = ['small', 'desktop']

describe('QATEST-155377 - Verify user should able to see Passkey (UI) option under Account settings and QATEST-155377 - Verify user should not able to see Passkey option under Account settings for Desktop ', () => {
  const size = ['small', 'desktop']
  size.forEach((size) => {
    it('Verify the Passkeys UI under account settings in Mobile Responsive and should not contain for Desktop', () => {
      cy.log('Creating a New Account')
      cy.c_createDemoAccount()
      cy.c_login()
      cy.get('a[href="/account/personal-details"]').click()
      cy.c_logout()
      cy.c_createApplicationId()
      cy.c_setEndpointUat()
      cy.c_login({ passkeys: true })

      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('/', size)
      if (isMobile) {
        cy.log('inside mobile ')
        cy.c_waitUntilElementIsFound({
          cyLocator: () => cy.findByText('Maybe later').click(),
          timeout: 3000,
          maxRetries: 5,
        })
        cy.c_waitUntilElementIsFound({
          cyLocator: () =>
            cy.get('.dc-text.main-title-bar__text').should('be.visible'),
          timeout: 3000,
          maxRetries: 3,
        })
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
          maxRetries: 3,
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

        cy.findAllByText('Just a reminder').should('be.visible')
        cy.findAllByText('Enable screen lock on your device.').should(
          'be.visible'
        )
        cy.findAllByText('Enable bluetooth.').should('be.visible')
        cy.findAllByText('Sign in to your Google or iCloud account.').should(
          'be.visible'
        )
        cy.findAllByText('Continue').should('be.visible')
        cy.get('.dc-modal-header__close').click()
        cy.get('.passkeys-status__description-back-button').click() // <- back icon

        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'Experience safer logins')
          .should('be.visible')
        cy.findByRole('button', { name: 'Create passkey' })
          .should('be.visible')
          .click()
        cy.findAllByText('Just a reminder').should('be.visible')
        cy.findAllByText('Enable screen lock on your device.').should(
          'be.visible'
        )
        cy.findAllByText('Enable bluetooth.').should('be.visible')
        cy.findAllByText('Sign in to your Google or iCloud account.').should(
          'be.visible'
        )
        cy.findAllByText('Continue').should('be.visible')
        cy.get('.dc-modal-header__close').click()
        cy.get('.dc-page-overlay__header-close').click() // 'X' icon
      } else {
        // Verify 'Passkey (New)' option should not available under Security and safety menu for desktop
        cy.log('inside Desktop')
        cy.get('a[href="/account/personal-details"]').click()
        cy.get('a#btnPasskeys.button.passkey-btn').should('not.exist')
      }
    })
  })
})
