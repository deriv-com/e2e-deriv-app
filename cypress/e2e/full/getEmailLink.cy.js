import '@testing-library/cypress/add-commands'
import 'cypress-mailisk'

describe('Test email verification', () => {
  const testEmailAddress = `test.${new Date().getTime()}@${Cypress.env('MAILISK_NAMESPACE')}.mailisk.net`

  it('Should sign up a new user', () => {
    cy.visit('http://deriv.com/signup/')
    cy.findByRole('button', { name: 'whatsapp icon' }).should('be.visible', {
      timeout: 30000,
    })
    cy.findByPlaceholderText('Email').click().type(testEmailAddress)
    cy.findByLabelText('I agree to the terms and conditions').check()
    cy.findByRole('button', { name: 'Create demo account' }).click()

    let link
    // mailiskSearchInbox will automatically keep retrying until an email matching the prefix arrives
    // by default it also has a from_timestamp that prevents older emails from being returned by accident
    // find out more here: https://docs.mailisk.com/guides/cypress.html#usage
    cy.mailiskSearchInbox(Cypress.env('MAILISK_NAMESPACE'), {
      to_addr_prefix: testEmailAddress,
      subject_includes: 'create your account',
      timeout: 1000 * 60,
    }).then((response) => {
      const emails = response.data
      const email = emails[0]

      const urlRegex = /https?:\/\/[^\s]+redirect\?[^\s]+/
      const match = email.text.match(urlRegex)

      // Extracting the matched URL
      if (match) {
        link = match[0]
        cy.log(link)
      } else {
        cy.log('URL with "redirect?" not found in the email text')
      }
    })
  })
})
