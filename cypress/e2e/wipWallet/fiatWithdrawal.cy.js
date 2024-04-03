import '@testing-library/cypress/add-commands'

Cypress.Commands.add('c_verifyWalletsWithdrawalScreenContentAfterLink', () => {
  let verification_url = Cypress.env('verificationUrl')
  const code = verification_url.match(/code=([A-Za-z0-9]{8})/)
  const verification_code = code[1]
  cy.c_visitResponsive(
    `/wallets/cashier/withdraw?verification=${verification_code}`,
    'large'
  )
  cy.findByTestId('dt_initial_loader').should('not.exist')
  cy.get('iframe[class=wallets-withdrawal-fiat__iframe]').should('be.visible')
  cy.enter('iframe[class=wallets-withdrawal-fiat__iframe]').then((getBody) => {
    getBody().find('#prCurrentBalance').should('be.visible')
    getBody().find('#prPayoutReview').should('be.visible')
    getBody().find('#prAvailableBalance').should('be.visible')
    getBody().find('#noPayoutOptionsMsg').should('be.visible')
  })
})

describe('WALL-2830 - Fiat withdrawal send email', () => {
  //Prerequisites: Fiat wallet account in backend prod staging with USD wallet
  beforeEach(() => {
    cy.c_login({ user: 'wallets', backEndProd: true })
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to send withdrawal verification link', () => {
    cy.log('Access Fiat Withdrawal Iframe')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_rateLimit({ waitTimeAfterError: 15000, maxRetries: 5 })
    cy.findByText('Withdraw').click()
    cy.findByText(/Please help us verify/).should('be.visible')
    if (cy.findByRole('button', { name: 'Send email' }).should('be.visible')) {
      cy.findByRole('button', { name: 'Send email' })
        .should('be.visible')
        .should('be.enabled')
        .wait(500)
        .click()
    }
    cy.findByText("We've sent you an email.")
    cy.findByRole('button', { name: "Didn't receive the email?" }).click()
    cy.findByText(/Resend email/)
  })
})

describe('WALL-2830 - Fiat withdrawal content access from email', () => {
  beforeEach(() => {
    cy.c_login({ user: 'wallets', backEndProd: true })
    cy.c_visitResponsive('/wallets', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_rateLimit({ waitTimeAfterError: 15000, maxRetries: 5 })
    cy.findByText('Withdraw').click()
  })

  it('should be able to access doughflow iframe', () => {
    cy.log('Access Fiat Withdrawal Iframe Through Email Link')
    cy.c_retrieveVerificationLinkUsingMailisk(
      Cypress.env('credentials').production.wallets.ID.split('@')[0],
      'withdrawal'
    )
    cy.c_verifyWalletsWithdrawalScreenContentAfterLink()
  })
})
