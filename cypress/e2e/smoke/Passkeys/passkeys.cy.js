import '@testing-library/cypress/add-commands'

describe('QATEST-142511, QATEST-125357 - Passkeys Login Page Button Check', () => {
  const size = ['small', 'desktop']

  size.forEach((size) => {
    it('Should contain Passkeys Button in Mobile Responsive and Should not contain on Desktop Version', () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive(
        Cypress.env('passkeyUrl') + '?app_id=' + Cypress.env('passkeyAppId'),
        size
      )
      if (isMobile) {
        // cy.findByText('Passkey').should('be.visible')
        cy.findByLabelText('Login with passkeys').should('be.visible')
      } else {
        cy.get('a#btnPasskeys.button.passkey-btn').should('not.exist')
      }
    })
  })
})
