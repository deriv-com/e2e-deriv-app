import '@testing-library/cypress/add-commands'

function clickAddMt5Button(accountType) {
  cy.findByText(accountType).parent().click()
}

function verifyJurisdictionSelection(accountType) {
  cy.findByText(
    `Choose a jurisdiction for your Deriv MT5 ${accountType} account`,
    { exact: true }
  ).should('be.visible')
  cy.findByText('St. Vincent & Grenadines').click()
  cy.findByRole('button', { name: 'Next' }).click()
}
function selectBVIJurisdiction(accountType) {
  cy.findByText(
    `Choose a jurisdiction for your Deriv MT5 ${accountType} account`
  ).should('be.visible')
  cy.findByText('British Virgin Islands', { exact: true }).click()
  cy.findByText('I confirm and accept Deriv (BVI) Ltd‘s').click()
  cy.findByRole('button', { name: 'Next' }).click()
}
function verifyDerivMT5Creation() {
  cy.findByPlaceholderText('Deriv MT5 password', { timeout: 10000 })
  cy.wait(2000) // this is needed since even for fisrt MT5 account creation, add mt5 modal opens for a second,
  cy.findByText('Enter your Deriv MT5 password')
    .should(() => {})
    .then(($text) => {
      if ($text.length) {
        cy.findByPlaceholderText('Deriv MT5 password')
          .click()
          .type(Cypress.env('mt5Password'))
        cy.findByRole('button', { name: 'Add account' }).click()
      } else {
        cy.findByPlaceholderText('Deriv MT5 password')
          .click()
          .type(Cypress.env('mt5Password'))
        cy.findByRole('button', { name: 'Create Deriv MT5 password' }).click()
      }
    })
}

function verifyTransferFundsMessage(accountType) {
  cy.findByText(
    `Transfer funds from your USD Wallet to your ${accountType} (SVG) account to start trading.`
  ).should('be.visible')
  cy.get(
    `div:contains("MT5 ${accountType} (SVG)USD Wallet0.00 USDYour ${accountType} (SVG) account is ready")`
  )
    .eq(2)
    .should('be.visible')
}

function verifyDemoCreationsMessage(accountType) {
  cy.findByText(`Your ${accountType} demo account is ready`).should(
    'be.visible'
  )
  cy.findByText(
    `Let's practise trading with 10,000.00 USD virtual funds.`
  ).should('be.visible')
  cy.findByRole('button', { name: 'OK' }).click()
}

function expandDemoWallet() {
  cy.get('.wallets-dropdown__button').click()
  cy.get('.wallets-list-card-dropdown__item-content')
    .contains('USD Demo Wallet')
    .click()
  cy.contains('USD Demo Wallet').should('be.visible')
}
function closeModal() {
  cy.findByRole('button', { name: 'Maybe later' }).should('exist')
  cy.findByRole('button', { name: 'Transfer funds' }).should('exist')
  cy.findByRole('button', { name: 'Maybe later' }).click()
}
describe('QATEST-98638 - Add Real SVG MT5 account and QATEST-98818 Add demo SVG MT5 account and QATEST-115487 Add real BVI MT5 account', () => {
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
  })

  it('should be able to create mt5 account', () => {
    cy.log('create mt5 svg account')
    cy.c_visitResponsive('/wallets', 'large')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    cy.findByText('Derived').should('be.visible')
    cy.findByText('This account offers CFDs on derived instruments.')
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          clickAddMt5Button('Derived')
          verifyJurisdictionSelection('Derived')
          verifyDerivMT5Creation()
          verifyTransferFundsMessage('Derived')
          closeModal()
        } else {
          cy.log('Derived SVG account not created. It already exists')
        }
      })

    cy.findByText('This account offers CFDs on financial instruments.')
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          clickAddMt5Button('Financial')
          verifyJurisdictionSelection('Financial')
          verifyDerivMT5Creation()
          verifyTransferFundsMessage('Financial')
          closeModal()
        } else {
          cy.log('Financial SVG account not created. It already exists')
        }
      })

    // create SVG swap free account
    // this part of the code is commented due to this bug https://app.clickup.com/t/20696747/WALL-3967
    // cy.findByText(
    //   'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs'
    // )
    //   .should(() => {})
    //   .then(($el) => {
    //     if ($el.length) {
    //       clickAddMt5Button('Swap-Free')
    //       verifyJurisdictionSelection('Swap-Free')
    //       verifyDerivMT5Creation()
    //       verifyTransferFundsMessage('Deriv MT5')
    //       closeModal()
    //     }
    //     else{
    //       cy.log('Swap-free SVG account not created. It already exists')
    //     }
    //   })
    // // create BVI Financial account
    cy.findByText('Get more')
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          cy.findByText('Get more', { exact: true }).click()
          cy.findByText('Select Deriv MT5’s account type').should('be.visible')
          cy.get('.wallets-mt5-account-type-card-list-content').first().click()
          cy.findByRole('button', { name: 'Next' }).click()
          selectBVIJurisdiction('Derived')
          cy.findByText('Please upload one of the following documents:')
            .should(() => {})
            .then(($el) => {
              if ($el) {
                cy.findAllByTestId('dt_modal_step_wrapper_header_icon').click()
              } else {
                cy.findByText('Complete your personal details')
                  .should(() => {})
                  .then(($el) => {
                    if ($el) {
                      cy.findByRole('heading', {
                        name: 'Complete your personal details',
                      }).should('exist')
                      cy.findByPlaceholderText('Tax residence*').click()
                      cy.findByPlaceholderText('Tax residence*').type(
                        'Indonesi'
                      )
                      cy.findByRole('option', { name: 'Indonesia' }).click()
                      cy.findByLabelText('Tax identification number*').click()
                      cy.findByLabelText('Tax identification number*').type(
                        '001234212343232'
                      )
                      cy.findByRole('button', { name: 'Next' }).click()
                      verifyDerivMT5Creation()
                      closeModal()
                    }
                  })
              }
            })
        } else {
          cy.log(`Get more button doesn't exist`)
        }
      })

    // Create Demo MT5 accounts
    cy.log('create demo mt5 svg account')
    cy.c_switchWalletsAccount('USD Demo')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    cy.findByText('This account offers CFDs on derived instruments.')
      .should(() => {})
      .then(($el) => {
        cy.log('account does not exist')
        if ($el.length) {
          clickAddMt5Button('Derived')
          verifyDerivMT5Creation()
          verifyDemoCreationsMessage('Derived')
        } else {
          cy.log('Demo dervied SVG account not created. It already exists ')
        }
      })

    cy.log('create demo mt5 svg financial account')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    cy.findByText('This account offers CFDs on derived instruments.')
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          clickAddMt5Button('Financial')
          verifyDerivMT5Creation()
          verifyDemoCreationsMessage('Financial')
        } else {
          cy.log('Demo financila SVG account not created. It already exists ')
        }
      })
  })

  it('should be able to create mt5 svg account in responsive', () => {
    cy.log('create mt5 svg account')
    cy.c_visitResponsive('/wallets', 'small')
    cy.c_skipPasskeysV2()
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    cy.findByText('This account offers CFDs on derived instruments.')
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          clickAddMt5Button('Derived')
          verifyJurisdictionSelection('Derived')
          verifyDerivMT5Creation()
          verifyTransferFundsMessage('Derived')
          closeModal()
        } else {
          cy.log('Derived SVG account not created. It already exists')
        }
      })

    cy.findByText('This account offers CFDs on financial instruments.')
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          clickAddMt5Button('Financial')
          verifyJurisdictionSelection('Financial')
          verifyDerivMT5Creation()
          verifyTransferFundsMessage('Financial')
          closeModal()
        } else {
          cy.log('Financila SVG account not created. It already exists')
        }
      })
    // create SVG swap free account
    // this part of the code is commented due to this bug https://app.clickup.com/t/20696747/WALL-3967
    // cy.findByText(
    //   'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs'
    // )
    //   .should(() => {})
    //   .then(($el) => {
    //     if ($el.length) {
    //       clickAddMt5Button('Swap-Free')
    //       verifyJurisdictionSelection('Swap-Free')
    //       verifyDerivMT5Creation()
    //       verifyTransferFundsMessage('Deriv MT5')
    //       closeModal()
    //     }
    //   })

    // create SVG Financial account
    cy.findByText('Get more')
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          cy.findByText('Get more', { exact: true }).click()
          cy.findByText('Select Deriv MT5’s account type').should('be.visible')
          cy.get('.wallets-mt5-account-type-card-list-content').first().click()
          cy.findByRole('button', { name: 'Next' }).click()
          selectBVIJurisdiction('Derived')
          cy.findByText('Please upload one of the following documents:')
            .should(() => {})
            .then(($el) => {
              if ($el) {
                cy.findAllByTestId('dt_modal_step_wrapper_header_icon').click()
              } else {
                cy.findByText('Complete your personal details')
                  .should(() => {})
                  .then(($el) => {
                    if ($el) {
                      cy.findByRole('heading', {
                        name: 'Complete your personal details',
                      }).should('exist')
                      cy.findByPlaceholderText('Tax residence*').click()
                      cy.findByPlaceholderText('Tax residence*').type(
                        'Indonesi'
                      )
                      cy.findByRole('option', { name: 'Indonesia' }).click()
                      cy.findByLabelText('Tax identification number*').click()
                      cy.findByLabelText('Tax identification number*').type(
                        '001234212343232'
                      )
                      cy.findByRole('button', { name: 'Next' }).click()
                      verifyDerivMT5Creation()
                      closeModal()
                    }
                  })
              }
            })
        } else {
          cy.log('Get more button is not visible')
        }
      })

    // Create Demo MT5 accounts
    cy.log('create demo mt5 svg account')
    cy.c_skipPasskeysV2()
    cy.c_switchWalletsAccountDemo()
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    cy.contains('Reset balance', { timeout: 10000 }).should('be.visible')
    cy.findByText('This account offers CFDs on derived instruments.')
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          clickAddMt5Button('Derived')
          verifyDerivMT5Creation()
          verifyDemoCreationsMessage('Derived')
        } else {
          cy.log('Demo derived SVG account not created. It already exists')
        }
      })

    cy.log('create demo mt5 svg financial account')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    cy.findByText('This account offers CFDs on derived instruments.')
      .should(() => {})
      .then(($el) => {
        if ($el.lengthl) {
          clickAddMt5Button('Financial')
          verifyDerivMT5Creation()
          verifyDemoCreationsMessage('Financial')
        } else {
          cy.log('demo Finnacial SVG account not created. It already exists')
        }
      })
    // add demo swap free account
    cy.findByText(
      'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs'
    )
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          clickAddMt5Button('Swap-Free')
          verifyJurisdictionSelection('Swap-Free')
          verifyDerivMT5Creation()
          verifyTransferFundsMessage('Deriv MT5')
          closeModal()
        } else {
          cy.log('Demo swap-free SVG account not created. It already exists')
        }
      })
  })
})
