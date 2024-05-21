import '@testing-library/cypress/add-commands'

describe('QATEST-820 - Perform Withdrawal for crypto account', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })
  it('should be able perform withdrawal for cryptocurrency.', () => {
    cy.get('#dt_cashier_tab').click().wait(1000)
    cy.get('#dc_withdrawal_link').click()
    cy.wait(1000)
    cy.c_closeNotificationHeader()
    cy.wait(1000)
    cy.get('[data-testid="dt_select_arrow"]').click({ force: true })
    cy.findByText('Ethereum').click()
    cy.c_closeNotificationHeader()
    cy.get('[data-testid="dt_empty_state_action"]').click()

    //Accessing the email
    cy.log('Access Crypto Withdrawal Content Through Email Link')
    cy.c_emailVerification(
      'request_payment_withdraw.html',
      Cypress.env('credentials').test.masterUser.ID
    )
    cy.then(() => {
      cy.c_visitResponsive(Cypress.env('verificationUrl'), 'desktop')
    })
    cy.contains('Transaction status')

    // Perform the withdrawals
    cy.findByTestId('dt_address_input')
      .next('label')
      .contains('Your ETH wallet address')
    cy.findByTestId('dt_address_input').type(
      '0xCfb00bEf3c1Cd90B2A23ce9810A0866d23EB3Be6'
    )
    cy.findByTestId('dt_converter_from_amount_input').type('0.05')
    cy.findByRole('button', { name: 'Withdraw' }).click()
    cy.wait(2000)
    cy.get('.transactions-crypto-transaction-status-side-note__button').click()
  })
})
