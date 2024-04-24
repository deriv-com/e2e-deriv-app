import '@testing-library/cypress/add-commands'

describe('WALL-2830 - Crypto withdrawal send email', () => {
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to send withdrawal verification link', () => {
    cy.log('Send Crypto Withdrawal Verification')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_switchWalletsAccount('BTC')
    cy.findByText('Withdraw').should('be.visible').click()
    cy.findByText('Confirm your identity to make a withdrawal.').should(
      'be.visible'
    )
    if (cy.findByRole('button', { name: 'Send email' }).should('be.visible')) {
      cy.findByRole('button', { name: 'Send email' }).click()
    }
    cy.contains("We've sent you an email.")
    cy.findByRole('button', { name: "Didn't receive the email?" }).click()
    cy.contains(/Resend email/)
  })
})

describe('WALL-2830 - Crypto withdrawal content access from email', () => {
  //Prerequisites: Crypto wallet account in qa29 with BTC balance
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
    cy.c_visitResponsive('/wallets', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_switchWalletsAccount('BTC')
    cy.findByText('Withdraw').should('be.visible').click()
  })

  it('should be able to access crypto withdrawal content and perform withdrawal', () => {
    cy.log('Access Crypto Withdrawal Content Through Email Link')
    cy.c_emailVerification(
      'request_payment_withdraw.html',
      Cypress.env('walletloginEmail')
    )
    cy.then(() => {
      let verification_code = Cypress.env('walletsWithdrawalCode')
      cy.c_visitResponsive(
        `/wallets/cashier/withdraw?verification=${verification_code}`,
        'large'
      )
      cy.contains('Transaction status')
      cy.contains('Your Bitcoin cryptocurrency wallet address').click().type(
        '1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71' //Example bitcoin wallet address
      )
      cy.contains('Amount (BTC)').click().type('0.005')
      cy.get('form').findByRole('button', { name: 'Withdraw' }).click()
      cy.get('#modal_root, .modal-root', { timeout: 10000 }).then(() => {
        if (cy.get('.wallets-button__loader')) {
          return
        } else {
          cy.contains('0.005000000 BTC', { exact: true })
          cy.contains('Your withdrawal is currently in process')
          cy.findByRole('button', { name: 'Close' }).click()
          cy.contains('Please help us verify')
        }
      })
    })
  })
})
