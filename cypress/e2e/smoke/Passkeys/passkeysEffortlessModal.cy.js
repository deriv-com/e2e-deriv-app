import '@testing-library/cypress/add-commands'

const username = Cypress.env('passkeyLoginEmail')
const password = Cypress.env('passkeyPassword')
const size = ['small', 'desktop']

describe('QATEST-142681 - Effortless login with passkeys Modal check ', () => {
  const size = ['small', 'desktop']

  size.forEach((size) => {
    it('Should display Effortless login with passkeys Modal in Mobile Responsive and Should not contain on Desktop Version', () => {
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

      if (isMobile) {
        cy.log('inside mobile ')
        cy.c_waitUntilElementIsFound({
          cyLocator: () =>
            cy.get('.dc-text.main-title-bar__text').should('be.visible'),
          timeout: 3000,
          maxRetries: 5,
        })
        cy.findByText('Maybe later').should('be.visible')
        cy.findByText('Effortless login with passkeys').should('be.visible')
        cy.findByText('No need to remember a password').should('be.visible')
        cy.findByText('Sync across devices').should('be.visible')
        cy.findByText(
          'Enhanced security with biometrics or screen lock'
        ).should('be.visible')
        cy.get('.dc-text.effortless-login-modal__overlay-tip').should(
          'be.visible'
        )
        cy.get(
          'p[class="dc-text effortless-login-modal__overlay-tip"] span[class="dc-text"]'
        )
          .should('be.visible')
          .click()

        //Verify the 'Learn More' screen
        cy.c_waitUntilElementIsFound({
          cyLocator: () => cy.findByText('Effortless login with passkeys'),
          timeout: 5000,
          maxRetries: 5,
        })
        cy.findByText('Effortless login with passkeys').should('be.visible')
        cy.findByText('What are passkeys?').should('be.visible')
        cy.findByText('Secure alternative to passwords.').should('be.visible')
        cy.findByText(
          'Unlock your account like your phone - with biometrics, face scan or PIN.'
        ).should('be.visible')
        cy.findByText('Why passkeys?').should('be.visible')
        cy.findByText('Extra security layer.').should('be.visible')
        cy.findByText(
          'Shields against unauthorised access and phishing.'
        ).should('be.visible')
        cy.findByText('How to create a passkey?').should('be.visible')
        cy.findByText('Go to ‘Account Settings’ on Deriv.').should('be.visible')
        cy.findByText('You can create one passkey per device.').should(
          'be.visible'
        )
        cy.findByText('Where are passkeys saved?').should('be.visible')
        cy.findByText('Android: Google password manager.').should('be.visible')
        cy.findByText('iOS: iCloud keychain.').should('be.visible')
        cy.findByText(
          'What happens if my Deriv account email is changed?'
        ).should('be.visible')
        cy.findByText('No problem! Your passkey still works.').should(
          'be.visible'
        )
        cy.findByText('Sign in to Deriv with your existing passkey.').should(
          'be.visible'
        )
        cy.findByText('Before using passkey:').should('be.visible')
        cy.findByText('Enable screen lock on your device.').should('be.visible')
        cy.findByText('Sign in to your Google or iCloud account.').should(
          'be.visible'
        )
        cy.findByText('Enable Bluetooth.').should('be.visible')
      }
    })
  })
})
