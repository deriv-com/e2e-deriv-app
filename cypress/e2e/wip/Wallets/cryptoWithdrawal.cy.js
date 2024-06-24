function sendWithdrawEmail(size) {
  if (size === 'small') {
    cy.c_switchWalletsAccountResponsive('BTC')
    cy.findByRole('button', { name: /withdrawal/i })
      .should('be.visible')
      .click()
  } else {
    cy.c_switchWalletsAccount('BTC')
    cy.findByText('Withdraw').should('be.visible').click()
  }

  cy.findByText('Confirm your identity to make a withdrawal.').should(
    'be.visible'
  )
  if (cy.findByRole('button', { name: 'Send email' }).should('be.visible')) {
    cy.findByRole('button', { name: 'Send email' }).click()
  }
  cy.findByText("We've sent you an email.").should('be.visible')

  cy.findByRole('button', { name: "Didn't receive the email?" }).click()
  cy.findByText(/Resend email/).should('be.visible')
}

function verifyEmailandPerformWithdraw(size) {
  if (size === 'small') {
    cy.c_switchWalletsAccountResponsive('BTC')
    cy.findByRole('button', { name: /withdrawal/i })
      .should('be.visible')
      .click()
  } else {
    cy.c_switchWalletsAccount('BTC')
    cy.findByText('Withdraw').should('be.visible').click()
  }

  cy.c_emailVerification(
    'request_payment_withdraw.html',
    Cypress.env('credentials').test.walletloginEmail.ID
  )

  cy.then(() => {
    let verification_code = Cypress.env('walletsWithdrawalCode')

    cy.c_visitResponsive(
      `/wallet/withdrawal?verification=${verification_code}`,
      size
    )

    cy.findByText('Transaction status').should('be.visible')
    cy.findByText('Your Bitcoin cryptocurrency wallet address').click().type(
      '1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71' //Example bitcoin wallet address
    )
    cy.findByText('Amount (BTC)').click().type('0.005')

    cy.get('.wallets-textfield__message-container')
      .eq(1)
      .invoke('text')
      .then(($text) => {
        cy.log($text)
        if ($text != '') {
          cy.get('.wallets-textfield__message-container')
            .invoke('text')
            .then((text) => {
              var fullText = text
              var pattern = /[0-9]+/g
              var number = fullText.match(pattern)
              console.log(number)
              cy.findByTestId('dt_withdrawal_crypto_amount_input')
                .click()
                .clear()
              cy.findByTestId('dt_withdrawal_crypto_amount_input')
                .click()
                .type('0.' + number[1])
            })
        }
      })

    cy.get('form').findByRole('button', { name: 'Withdraw' }).click()

    cy.get('#modal_root, .modal-root', { timeout: 10000 }).then(() => {
      if (cy.get('.wallets-button__loader')) {
        return
      } else {
        cy.findByText('0.005000000 BTC', { exact: true }).should('be.visible')
        cy.findByText('Your withdrawal is currently in process').should(
          'be.visible'
        )

        cy.findByRole('button', { name: 'Close' }).click()
        cy.findByText('Please help us verify').should('be.visible')
      }
    })
  })
}

describe('WALL-2830 - Crypto withdrawal send email', () => {
  const size = ['small', 'desktop']

  size.forEach((size) => {
    it(`should be able to send withdrawal verification link on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      cy.c_login({ user: 'walletloginEmail' })

      cy.log('Send Crypto Withdrawal Verification')
      cy.c_visitResponsive('/', size)
      cy.findByText('Wallet', { timeout: 10000 }).should('be.visible')
      sendWithdrawEmail(size)
    })
  })
})

describe('QATEST-98698 - Crypto withdrawal content access from email', () => {
  //Prerequisites: Crypto wallet account in qa29 with BTC balance
  const size = ['small', 'desktop']

  size.forEach((size) => {
    it(`should be able to access crypto withdrawal content and perform withdrawal on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      cy.c_login({ user: 'walletloginEmail' })

      cy.log('Access Crypto Withdrawal Content Through Email Link')
      cy.c_visitResponsive('/', size)
      cy.findByText('Wallet', { timeout: 10000 }).should('be.visible')
      verifyEmailandPerformWithdraw(size)
    })
  })
})
