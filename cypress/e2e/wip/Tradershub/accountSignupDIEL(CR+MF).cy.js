import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/helper/utility'

describe('QATEST-5554: Verify DIEL Signup flow - CR + MF', () => {
  const size = ['small', 'desktop']
  let country = Cypress.env('countries').ZA
  let nationalIDNum = Cypress.env('nationalIDNum').ZA
  let taxIDNum = Cypress.env('taxIDNum').ZA
  let currency = Cypress.env('accountCurrency').USD

  size.forEach((size) => {
    it(`Verify I can signup for a DIEL demo and real account on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      const signUpEmail = `sanity${generateEpoch()}diel@deriv.com`
      cy.c_setEndpoint(signUpEmail, size)
      Cypress.env('citizenship', country)
      cy.c_demoAccountSignup(country, signUpEmail, size)
      cy.c_checkTradersHubHomePage(isMobile)
      if (isMobile)
        cy.findByText('Non-EU').should(
          'have.class',
          'dc-tabs__item--is-scrollable-and-active'
        )
      else cy.findByText('Non-EU').parent().should('have.class', 'is-selected')
      // cy.findByRole('button', { name: 'Get a Deriv account' }).click()
      cy.findByTestId('dt_trading-app-card_real_deriv-account')
        .findByRole('button', { name: 'Get' })
        .click()
      cy.c_generateRandomName().then((firstName) => {
        cy.c_personalDetails(
          firstName,
          'IDV',
          country,
          nationalIDNum,
          taxIDNum,
          currency,
          { isMobile: isMobile }
        )
      })
      cy.contains(
        'Only use an address for which you have proof of residence'
      ).should('be.visible')
      cy.c_addressDetails()
      cy.c_completeFatcaDeclarationAgreement()
      cy.c_addAccount({ isMobile: isMobile })
      cy.c_closeNotificationHeader()
      cy.findByText('EU', { exact: true }).click()
      if (isMobile)
        cy.findByText('EU').should(
          'have.class',
          'dc-tabs__item--is-scrollable-and-active'
        )
      else cy.findByText('EU').parent().should('have.class', 'is-selected')
      cy.findByRole('button', { name: 'Get a Deriv account' }).click()
      cy.findByText('US Dollar').click()
      cy.findByRole('button', { name: 'Next' }).click()
      cy.get('[type="radio"]').first().click({ force: true })
      if (isMobile) {
        cy.get(`select[name='employment_status']`).select('Employed')
      } else {
        cy.findByTestId('dt_personal_details_container')
          .findAllByTestId('dt_dropdown_display')
          .eq(0)
          .click()
        cy.get('#Employed').click()
      }
      cy.get('.dc-checkbox__box').click()
      cy.findByRole('button', { name: 'Next' }).click()
      cy.findByRole('button', { name: 'Next' }).click()
      cy.c_completeTradingAssessment({ isMobile: isMobile })
      cy.c_completeFinancialAssessment({ isMobile: isMobile })
      cy.c_addAccountMF('', { isMobile: isMobile })
      cy.c_manageAccountsetting(country, { isMobile: isMobile })
    })
  })
})
