import '@testing-library/cypress/add-commands'

const toCurrency = {
  name: 'Bitcoin',
  code: 'BTC',
}
const fromCurrency = {
  name: 'US Dollar',
  code: 'USD',
}

Cypress.Commands.add('c_checkAccountExists', (currency) => {
  cy.findByTestId('dt_currency-switcher__arrow').click()
  cy.findByText('Select account').should('be.visible')
  cy.document().then((doc) => {
    sessionStorage.setItem(`c_is${currency.code}AccountCreated`, false)
    doc
      .querySelectorAll('.currency-item-card__details .dc-text')
      .forEach((element) => {
        if (element.textContent.includes(currency.name)) {
          cy.log(`Account for currency ${currency.name} already exists`)
          sessionStorage.setItem(`c_is${currency.code}AccountCreated`, true)
        }
      })
  })
})

Cypress.Commands.add('c_CreateNewCurrencyAccount', (currency) => {
  cy.get('.dc-modal').within(() => {
    cy.findByRole('button', { name: 'Add or manage account' }).click()
    cy.findByRole('heading', {
      name: 'Choose your preferred cryptocurrency',
    }).should('exist')
    cy.findByText(currency.name).click()
    cy.findByRole('button', { name: 'Add account' }).click()
    cy.findByText('Success!').should('exist')
    cy.findByText(`You have added a ${currency.code} account.`).should(
      'be.visible'
    )
    cy.findByRole('button', { name: 'Maybe later' }).click()
  })
})

Cypress.Commands.add('c_openCurrencyAccountSelector', () => {
  cy.findByTestId('dt_currency-switcher__arrow').click()
  cy.findByText('Select account').should('be.visible')
})

Cypress.Commands.add('c_selectCurrency', (currency) => {
  cy.c_openCurrencyAccountSelector()
  cy.findByText(currency.name).click()
})

Cypress.Commands.add('c_verifyActiveCurrency', (currency) => {
  cy.c_openCurrencyAccountSelector()
  cy.get('.dc-modal').within(() => {
    cy.findByText(currency.name)
      .parentsUntil('.currency-item-card')
      .should('have.class', 'currency-item-card currency-item-card--active')
  })
})

describe('QATEST-20036 - Transfer: Enter USD amount when Transfer Fiat to Crypto', () => {
  beforeEach(() => {
    cy.clearAllSessionStorage()
    cy.c_login()
    cy.c_visitResponsive('appstore/traders-hub', 'desktop')
    cy.findByText('Options & Multipliers').should('be.visible')
    cy.c_verifyActiveCurrency(fromCurrency)
    cy.c_checkAccountExists(toCurrency)
    if (
      sessionStorage.getItem(`c_is${toCurrency.code}AccountCreated`) == 'false'
    ) {
      cy.c_CreateNewCurrencyAccount(toCurrency)
    } else if (
      sessionStorage.getItem(`is${toCurrency}AccountCreated`) == 'true'
    ) {
      cy.get('.dc-modal').within(() => {
        cy.get('.currency-selection-modal__header .dc-icon close-icon').click()
      })
    }
    cy.c_selectCurrency(fromCurrency)
  })

  it('should transfer amount from fiat to crypto account.', () => {
    cy.c_visitResponsive('/cashier/account-transfer/', 'desktop')
    cy.c_loadingCheck()
    cy.findByRole('heading', {
      name: 'Transfer between your accounts in Deriv',
    }).should('exist')
    cy.get('form[class="account-transfer-form"]').within(() => {
      cy.contains('span[class="dc-dropdown__label"]', 'From').next().click()
      cy.findByTestId('dt_account_transfer_form_drop_down_wrapper')
        .findByTestId('dt_themed_scrollbars')
        .should('be.visible')
        .within(() => {
          cy.findByText(fromCurrency.name).click({ force: true })
        })
      cy.contains('span[class="dc-dropdown__label"]', 'To').next().click()
      cy.findByTestId('dt_account_transfer_form_drop_down_wrapper')
        .findByTestId('dt_themed_scrollbars')
        .should('be.visible')
        .within(() => {
          cy.findByText(toCurrency.name).click({ force: true })
        })
      cy.get('p[class="dc-text dc-dropdown__hint"]').then(($el) => {
        cy.log($el.text())
      })
    })
  })
})
