import '@testing-library/cypress/add-commands'

const toCurrency = {
  name: 'Bitcoin',
  code: 'BTC',
}
const fromCurrency = {
  name: 'US Dollar',
  code: 'USD',
}

describe('QATEST-20036 - Transfer: Enter USD amount when Transfer Fiat to Crypto', () => {
  beforeEach(() => {
    cy.clearAllSessionStorage()
    cy.c_login()
    cy.c_visitResponsive('appstore/traders-hub', 'desktop')
    cy.findByText('Options & Multipliers').should('be.visible')
    cy.findByTestId('dt_currency-switcher__arrow').click()
    cy.findByText('Select account').should('be.visible')
    cy.document().then((doc) => {
      sessionStorage.setItem(`c_is${toCurrency.code}AccountCreated`, false)
      doc
        .querySelectorAll('.currency-item-card__details .dc-text')
        .forEach((element) => {
          if (element.textContent.includes(toCurrency.name)) {
            cy.log(`Account for currency ${toCurrency.name} already exists`)
            sessionStorage.setItem(`c_is${toCurrency.code}AccountCreated`, true)
          }
        })
      if (
        sessionStorage.getItem(`c_is${toCurrency.code}AccountCreated`) ==
        'false'
      ) {
        cy.get('.dc-modal').within(() => {
          cy.findByRole('button', { name: 'Add or manage account' }).click()
          cy.findByRole('heading', {
            name: 'Choose your preferred cryptocurrency',
          }).should('exist')
          cy.findByText(toCurrency.name).click()
          cy.findByRole('button', { name: 'Add account' }).click()
          cy.findByText('Success!').should('exist')
          cy.findByText(`You have added a ${toCurrency.code} account.`).should(
            'be.visiblie'
          )
          cy.findByRole('button', { name: 'Maybe later' }).click()
        })
      } else if (
        sessionStorage.getItem(`is${toCurrency}AccountCreated`) == 'true'
      ) {
        cy.get('.dc-modal').within(() => {
          cy.get(
            '.currency-selection-modal__header .dc-icon close-icon'
          ).click()
        })
      }
    })
  })

  it('should transfer amount from fiat to crypto account.', () => {
    cy.c_visitResponsive('/cashier/account-transfer/', 'desktop')
    cy.c_waitForLoader()
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
