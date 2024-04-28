import '@testing-library/cypress/add-commands'

function changeMT5Password() {
  cy.findAllByText('Derived')
    .parents('.wallets-available-mt5__details')
    .next()
    .invoke('text')
    .then(($text) => {
      cy.log($text)
      const buttonText = $text.trim()
      if (buttonText === 'Open') {
        cy.findAllByRole('button', { name: 'Open' }).eq(0).click()
        cy.findByText('DerivSVG-Server').should('be.visible')
        cy.findByText('Password')
          .parent()
          .within(() => {
            cy.get('.wallets-tooltip').click()
          })
        cy.findByText('Manage Deriv MT5 password').should('be.visible')
        cy.findByText(
          'Use this password to log in to your Deriv MT5 accounts on the desktop, web, and mobile apps.'
        ).should('be.visible')
        cy.findByRole('button', { name: 'Change password' }).click()
        cy.contains('Confirm to change your Deriv').should('exist')
        cy.contains('This will change the password to all of your ').should(
          'exist'
        )
        cy.findByRole('button', { name: 'Confirm' }).click()
        cy.findByText('We’ve sent you an email').should('exist')
        cy.findByRole('button', { name: "Didn't receive the email?" }).should(
          'exist'
        )
        cy.findByRole('button', { name: 'Investor Password' }).should('exist')
        cy.c_emailVerification(
          'New%20DMT5%20password%20request.html',
          'QA script',
          { baseUrl: Cypress.env('configServer') + '/emails' }
        )
        cy.then(() => {
          cy.c_visitResponsive(Cypress.env('verificationUrl'), 'large')
        })
        cy.get('div')
          .contains('Create a new Deriv MT5 Password')
          .should('be.visible')
        cy.findByPlaceholderText('Deriv MT5 password')
          .click()
          .type(Cypress.env('mt5Password'))
        cy.findByRole('button', { name: 'Create' }).click()
      }
    })
}
describe('WALL-3255 - Reset MT5 password', () => {
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
  })

  it('should be able to change mt5 password', () => {
    cy.log('change mt5 password')
    cy.c_visitResponsive('/wallets', 'large')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    changeMT5Password()
  })
  it('should be able to change mt5 password', () => {
    cy.log('change mt5 password')
    cy.c_visitResponsive('/wallets', 'small')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    changeMT5Password()
  })
})
