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
