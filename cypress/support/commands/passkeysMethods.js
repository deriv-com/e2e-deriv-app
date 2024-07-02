import { getOAuthUrl, setLoginUser } from '../helper/loginUtility'

/**
 * Method to Set the Endpoint for UAT URL.
 * This will Set the endpoint
 */
Cypress.Commands.add('c_setEndpointUat', () => {
  try {
    const newAppId = parseInt(Cypress.env('updatedAppId'))
    cy.c_visitResponsive(Cypress.env('passkeyUrl') + '/endpoint')
    cy.findByLabelText('Server').click().clear()
    cy.findByLabelText('Server').type(Cypress.env('configServer'))
    cy.findByLabelText('OAuth App ID').click().clear()
    cy.findByLabelText('OAuth App ID').type(newAppId)
    cy.findByRole('button', { name: 'Submit' }).click()
  } catch (e) {
    console.error('An error occurred during the login process:', e)
  }
})

/**
 * Method to Verify the 'Experience safer logins' screen.
 * This will verify the content on 'Experience safer logins' screen
 */
Cypress.Commands.add('c_experienceSafeLogin', () => {
  try {
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
  } catch (e) {
    console.error(
      'An error occurred during the verify the content on Experience safer logins screen:',
      e
    )
  }
})

/**
 * Method to Verify the 'Learn More' screen.
 * This will verify the content on 'Learn More' screen
 */
Cypress.Commands.add('c_passkeysLearnMore', () => {
  try {
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
      .should('contain.text', 'Sign in to Deriv with your existing passkey.')
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
  } catch (e) {
    console.error(
      'An error occurred during the verify the content on Learn Mores screen:',
      e
    )
  }
})

Cypress.Commands.add('c_justAReminderPopUp', () => {
  try {
    cy.findByRole('button', { name: 'Create passkey' })
      .should('be.visible')
      .click()
    cy.findAllByText('Just a reminder').should('be.visible')
    cy.findAllByText('Enable screen lock on your device.').should('be.visible')
    cy.findAllByText('Enable bluetooth.').should('be.visible')
    cy.findAllByText('Sign in to your Google or iCloud account.').should(
      'be.visible'
    )
    cy.findAllByText('Continue').should('be.visible')
    cy.get('.dc-modal-header__close').click()
  } catch (e) {
    console.error(
      'An error occurred during the verify the content on Experience safer logins screen:',
      e
    )
  }
})
