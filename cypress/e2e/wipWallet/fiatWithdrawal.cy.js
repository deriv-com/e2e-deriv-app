import '@testing-library/cypress/add-commands'

describe('WALL-2830 - Fiat withdrawal send email', () => {
  //Prerequisites: Fiat wallet account in qa04 with USD wallet
  beforeEach(() => {
    cy.c_login({ app: 'doughflow' })
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to send withdrawal verification link', () => {
    cy.log('Access Fiat Withdrawal Iframe')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.findByText('Withdraw').click()
    cy.findByText('Please help us verify').should('be.visible')
    if (cy.findByRole('button', { name: 'Send email' }).should('be.visible')) {
      cy.findByRole('button', { name: 'Send email' }).click()
    }
    cy.findByText("We've sent you an email.")
    cy.findByRole('button', { name: "Didn't receive the email?" }).click()
    cy.findByText(/Resend email/)
  })
})

describe('WALL-2830 - Crypto withdrawal content access from email', () => {
  beforeEach(() => {
    cy.c_login('doughflow')
    cy.c_visitResponsive('/wallets', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.findByText('Withdraw').click()
  })

  it('should be able to access doughflow iframe', () => {
    cy.log('Access Fiat Withdrawal Iframe Through Email Link')
    cy.c_emailVerification(
      'request_payment_withdraw.html',
      Cypress.env('walletloginEmail')
    )
    let verification_code = Cypress.env('walletsWithdrawalCode')
    cy.then(() => {
      cy.c_visitResponsive(
        `/wallets/cashier/withdraw?verification=${verification_code}`,
        'large'
      )
    })
  })
})
