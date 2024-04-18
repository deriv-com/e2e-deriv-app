import { derivApp } from '../locators/index'

Cypress.Commands.add('c_verifycontentWithdrawalPage', (state) => {
  if (state == 'beforeRequest') {
    derivApp.cashierPage.withdrawal
      .verifyWithdrawalRequestTitle()
      .should('contain.text', 'Please help us verify your withdrawal request.')
    derivApp.cashierPage.withdrawal
      .verifyWithdrawalRequestDescription()
      .should(
        'contain.text',
        "Click the button below and we'll send you an email with a link. Click that link to verify your withdrawal request."
      )
  } else if (state == 'afterRequest') {
    derivApp.cashierPage.withdrawal
      .verifyWithdrawalRequestTitle()
      .should('contain.text', "We've sent you an email.")
    derivApp.cashierPage.withdrawal
      .verifyWithdrawalRequestDescription()
      .should(
        'contain.text',
        'Please check your email for the verification link to complete the process.'
      )
  }
})
