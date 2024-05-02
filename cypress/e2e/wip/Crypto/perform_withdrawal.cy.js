import '@testing-library/cypress/add-commands'

Cypress.Commands.add('c_checkWithdrawalReportBO', (clientHash) => {
  cy.visit(
    `https://${Cypress.env('configServer')}/d/backoffice/f_broker_login.cgi`
  )
  cy.origin(
    `https://${Cypress.env('configServer')}/d/backoffice/f_broker_login.cgi`,
    { args: [clientHash] },
    ([clientHash]) => {
      cy.get('body').should('be.visible')
      // BO Steps here
    }
  )
})

describe('QATEST-707 - Create crypto account', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })
  it('should be able to create crypto account from Traders Hub.', () => {
    //cy.wait(1000)
    cy.get('#dt_cashier_tab').click().wait(1000)
    cy.get('#dc_withdrawal_link').click()
    cy.wait(1000)
    // cy.xpath('(//button[@class="notification__close-button"])[1]').click();
    //cy.xpath('(//button[@class="notification__close-button"])[2]').click();
    cy.c_closeNotificationHeader()
    cy.wait(1000)
    cy.get('[data-testid="dt_select_arrow"]').click({ force: true })
    //cy.contains('.acc-switcher__list','Ethereum').click()
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
    //cy.c_checkWithdrawalReportBO('abc')

    //PERFORM WITHDRAWAL
    //  cy.get('dc-input__container').type ('0xCfb00bEf3c1Cd90B2A23ce9810A0866d23EB3Be6')
    // c-input cashier__input withdraw__input
    //  cy.get('dc-input__container').contains('Your ETH wallet address').click().type(
    //  '0xCfb00bEf3c1Cd90B2A23ce9810A0866d23EB3Be6'
    // )

    cy.contains('Transaction status')
    // cy.get('[data-test-id="myID"]')
    // cy.get('input[data-test-id="myID"]')

    cy.findByTestId('dt_address_input')
      .next('label')
      .contains('Your ETH wallet address')
    cy.findByTestId('dt_address_input').type(
      '0xCfb00bEf3c1Cd90B2A23ce9810A0866d23EB3Be6'
    )
    cy.findByTestId('dt_converter_from_amount_input').type('0.017')
    cy.findByRole('button', { name: 'Withdraw' }).click()

    //ACCESSING BO

    /*cy.then(() => {
      let verification_code = Cypress.env('walletsWithdrawalCode')
      cy.c_visitResponsive(
        `/wallets/cashier/withdraw?verification=${verification_code}`,
        'large'
      )
      cy.contains('Transaction status')
      cy.contains('Your Bitcoin cryptocurrency wallet address').click().type(
        '1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71' //Example bitcoin wallet address
      )
      cy.contains('Amount (BTC)').click().type('0.0005')
      cy.get('form').findByRole('button', { name: 'Withdraw' }).click()
      cy.get('#modal_root, .modal-root', { timeout: 10000 }).then(() => {
        if (cy.get('.wallets-button__loader')) {
          return
        } else {
          cy.contains('0.000500000 BTC', { exact: true })
          cy.contains('Your withdrawal is currently in process')
          cy.findByRole('button', { name: 'Close' }).click()
          cy.contains('Please help us verify')
        }
      })
    })*/

    //Accessing BO
    /*cy.visit(
      `https://${Cypress.env('qaBoxLoginEmail')}:${Cypress.env(
        'qaBoxLoginPassword'
      )}@${baseUrl}`
    )
    cy.origin(
      `https://${Cypress.env('qaBoxLoginEmail')}:${Cypress.env(
        'qaBoxLoginPassword'
      )}@${baseUrl}`,
      { args: [requestType, accountEmail] },
      ([requestType, accountEmail]) => {
        cy.document().then((doc) => {
          const allRelatedEmails = Array.from(
            doc.querySelectorAll(`a[href*="${requestType}"]`)
          )
          if (allRelatedEmails.length) {
            const verificationEmail = allRelatedEmails.pop()
            cy.wrap(verificationEmail).click()
            cy.contains('p', `${accountEmail}`)
              .should('be.visible')
              .parent()
              .children()
              .contains('a', Cypress.config('baseUrl'))
              .invoke('attr', 'href')
              .then((href) => {
                if (href) {
                  Cypress.env('verificationUrl', href)
                  const code = href.match(/code=([A-Za-z0-9]{8})/)
                  verification_code = code[1]
                  Cypress.env('walletsWithdrawalCode', verification_code)
                  cy.log('Verification link found')
                } else {
                  cy.log('Verification link not found')
                }
              })
          } else {
            cy.log('email not found')
          }
        })
      }
    )*/
  })
})
