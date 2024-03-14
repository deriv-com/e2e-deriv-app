import '@testing-library/cypress/add-commands'

describe('WALL-2830 - Crypto withdrawal send email', () => {
  beforeEach(() => {
    cy.c_login('wallets')
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to send withdrawal verification link', () => {
    cy.log('Send Crypto Withdrawal Verification')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.get('.wallets-dropdown__button').click()
    cy.get('.wallets-list-card-dropdown__item-content')
      .contains('BTC Wallet')
      .click()
    cy.get('.wallets-list-details__content').within(() => {
      cy.contains('BTC').should('be.visible')
    })
    cy.contains('Withdraw').click()
    cy.contains('Please help us verify').should('be.visible')
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
  let verification_code = Cypress.env('walletsWithdrawalCode')
  const withdrawal_url = Cypress.env('walletsWithdrawalUrl')

  beforeEach(() => {
    cy.c_login('wallets')
    cy.c_visitResponsive('/wallets', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.get('.wallets-dropdown__button').click()
    cy.get('.wallets-list-card-dropdown__item-content')
      .contains('BTC Wallet')
      .click()
    cy.get('.wallets-list-details__content').within(() => {
      cy.contains('BTC').should('be.visible')
    })
    cy.contains('Withdraw').click()
  })

  it('should be able to access crypto withdrawal content and perform withdrawal', () => {
    cy.log('Access Crypto Withdrawal Content Through Email Link')
    cy.c_emailVerification(verification_code, Cypress.env('mainQaBoxBaseUrl'))

    cy.then(() => {
      Cypress.config('baseUrl')
      cy.c_visitResponsive(
        `${withdrawal_url}?verification=${verification_code}`,
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
          cy.contains('0.00500000 BTC', { exact: true })
          cy.contains('Your withdrawal is currently in process')
          cy.findByRole('button', { name: 'Close' }).click()
          cy.contains('Please help us verify')
        }
      })
    })
  })
})
