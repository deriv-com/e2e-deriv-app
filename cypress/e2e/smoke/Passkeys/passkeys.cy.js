import '@testing-library/cypress/add-commands'

describe('QATEST - 142511, QATEST - 125330 - Passkeys Login Page Button Check', () => {
  const size = ['small', 'desktop']

  beforeEach(() => {
    Cypress.env('stdConfigAppId', Cypress.env('passkeyAppId'))
  })

  size.forEach((size) => {
    it('Should contain Passkeys Button in Mobile Responsive and Should not contain on Desktop Version', () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('/', size)
      cy.visit(
        Cypress.env('passkeyUrl') + '?app_id=' + Cypress.env('stdConfigAppId')
      )
      if (isMobile) {
        cy.findByText('Passkey').should('be.visible')
      } else {
        cy.get('a#btnPasskeys.button.passkey-btn').should('not.exist')
      }
    })
  })
})
