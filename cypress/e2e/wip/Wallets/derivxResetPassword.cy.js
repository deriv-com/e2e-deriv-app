import '@testing-library/cypress/add-commands'

function changeDerivxPassword() {
  cy.findByText('Deriv X').parent().click()
  cy.findByText('Deriv X SVG').should('be.visible')
  cy.findByText('Password')
    .parent()
    .within(() => {
      cy.get('.wallets-tooltip').click()
    })
  cy.findByText('Manage Deriv X password').should('be.visible')
  cy.findByText(
    'Use this password to log in to your Deriv X accounts on the desktop, web, and mobile apps.'
  ).should('be.visible')
  cy.findByRole('button', { name: 'Change password' }).click()
  cy.findByText('Confirm to change your Deriv X password').should('be.visible')
  cy.contains('This will change the password to all of your ').should('exist')
  cy.findByRole('button', { name: 'Confirm' }).click()
  cy.findByText('We’ve sent you an email').should('exist')
  cy.findByRole('button', { name: "Didn't receive the email?" }).should('exist')
  cy.c_emailVerification(
    'New%20Deriv%20X%20password%20request.html',
    'QA script',
    { baseUrl: Cypress.env('configServer') + '/emails' }
  )
  cy.then(() => {
    cy.c_visitResponsive(Cypress.env('verificationUrl'), 'large')
  })
  cy.get('div').contains('Create a new Deriv X password').should('be.visible')
  cy.findByPlaceholderText('Deriv X password')
    .click()
    .type(Cypress.env('mt5Password'))
  cy.findByRole('button', { name: 'Create' }).click()
}
describe('QATEST-121523 - Forget DerivX password', () => {
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
  })

  it('should be able to change derivx password', () => {
    cy.log('change derivx password')
    cy.c_visitResponsive('/wallets', 'large')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    cy.c_skipPasskeysV2()
    cy.findByText(
      'This account offers CFDs on a highly customisable CFD trading platform.'
    )
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          cy.log(`Derivx account doesn't exist`)
        } else {
          changeDerivxPassword()
        }
      })
  })
  it('should be able to change derivx password in responsive', () => {
    cy.log('change derivx password')
    cy.c_visitResponsive('/wallets', 'small')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    cy.c_skipPasskeysV2()
    cy.findByText('Deriv X', { timeout: 10000 }).should('exist')
    cy.findByText(
      'This account offers CFDs on a highly customisable CFD trading platform.'
    )
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          cy.log(`Derivx account doesn't exist`)
        } else {
          changeDerivxPassword()
        }
      })
  })
})
