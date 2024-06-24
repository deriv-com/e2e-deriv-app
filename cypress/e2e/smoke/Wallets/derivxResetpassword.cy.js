function clickAddDerivxButton() {
  cy.get('.wallets-available-dxtrade__icon')
    .parent('.wallets-trading-account-card')
    .click()
}

function verifyDerivxCreation(accountType) {
  let expectedText
  if (accountType === 'Real') {
    cy.get('div').contains('Create a Deriv X password').should('be.visible')
    cy.findByPlaceholderText('Deriv X password')
      .click()
      .type(Cypress.env('mt5Password'))
    cy.findByRole('button', { name: 'Create Deriv X password' }).click()
  } else {
    cy.get('div').contains('Enter your Deriv X password').should('be.visible')
    cy.findByPlaceholderText('Deriv X password')
      .click()
      .type(Cypress.env('mt5Password'))
    cy.findByRole('button', { name: 'Add account' }).click()
  }
}

function verifyTransferFundsMessage(accountType) {
  if (accountType === 'Real') {
    cy.findByText('Your Deriv X account is ready').should('be.visible')
    cy.findByRole('button', { name: 'Maybe later' }).should('be.visible')
    cy.findByRole('button', { name: 'Transfer funds' }).should('be.visible')
    cy.findByRole('button', { name: 'Maybe later' }).click()
  } else {
    cy.findByText('Your Deriv X demo account is ready').should('be.visible')
    cy.findByRole('button', { name: 'OK' }).click()
  }
}

function addDerivXaccount(status, accountType) {
  if (status === 'available') {
    cy.log(accountType + ' DerivX account ready to add')
    clickAddDerivxButton()
    verifyDerivxCreation(accountType)
    verifyTransferFundsMessage(accountType)
  } else if (status === 'added') {
    cy.log(accountType + ' DerivX account added already')
    cy.get('.wallets-added-dxtrade__details')
      .should('exist')
      .within(() => {
        cy.contains('.wallets-text', 'Deriv X').should('exist')
      })
  } else {
    cy.log('Neither found')
  }
}
function changeDerivxPassword(device) {
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
    {
      baseUrl: Cypress.env('configServer') + '/emails',
      isMT5ResetPassword: true,
    }
  )
  cy.then(() => {
    cy.c_visitResponsive(Cypress.env('verificationUrl'), `${device}`)
  })
  cy.get('div').contains('Create a new Deriv X password').should('be.visible')
  cy.findByPlaceholderText('Deriv X password')
    .click()
    .type(Cypress.env('mt5Password'))
  cy.findByRole('button', { name: 'Create' }).click()
}
function verifyChangePasswordSuccess() {
  cy.findByTestId('dt_modal_step_wrapper').should('be.visible') // Success message modal
  cy.findByText('Manage Deriv X password').should('be.visible')
  cy.findByText('Success').should('be.visible')
  cy.findByText(
    'You have a new Deriv X password to log in to your Deriv X accounts on the web and mobile apps.'
  ).should('be.visible')
  cy.findByText('Done').parent().click()
}
describe('QATEST-121523 - Forget DerivX password', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletloginEmail' })
  })

  it('should be able to change derivx password', () => {
    cy.c_visitResponsive('/', 'large')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    cy.get('.wallets-trading-account-card__content')
      .contains('.wallets-text', 'Financial', { timeout: 10000 })
      .parent()
      .closest('.wallets-added-mt5__details, .wallets-available-mt5__details')
      .should('be.visible') // to check page is loaded
    cy.findByText('Deriv X', { timeout: 10000 }).should('exist')
    cy.findByText(
      'CFDs on financial and derived instruments via a customisable platform.'
    )
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          cy.log(`Derivx account doesn't exist`)
          addDerivXaccount('available', 'Real')
          changeDerivxPassword('large')
          verifyChangePasswordSuccess()
        } else {
          changeDerivxPassword('large')
          verifyChangePasswordSuccess()
        }
      })
  })
  it('should be able to change derivx password in responsive', () => {
    cy.c_visitResponsive('/', 'small')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    cy.c_skipPasskeysV2()
    cy.findByText('Deriv X', { timeout: 10000 }).should('exist')
    cy.c_skipPasskeysV2() // passkey could appear after page is fully loeaded
    cy.findByText(
      'CFDs on financial and derived instruments via a customisable platform.'
    )
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          cy.log(`Derivx account doesn't exist`)
          addDerivXaccount('available', 'Real')
          changeDerivxPassword('small')
        } else {
          changeDerivxPassword('small')
        }
      })
  })
})
