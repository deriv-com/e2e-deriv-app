import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/helper/utility'

describe('QATEST-6211: Verify DIEL Signup flow - MF + CR', () => {
  const size = ['small', 'desktop']
  const country = Cypress.env('countries').ZA
  const nationalIDNum = Cypress.env('nationalIDNum').ZA
  const taxIDNum = Cypress.env('taxIDNum').ZA
  const euCurrency = Cypress.env('accountCurrency').EUR

  size.forEach((size) => {
    it(`Verify I can signup for a DIEL demo and real account on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      const signUpEmail = `sanity${generateEpoch()}dielmfcr@deriv.com`
      cy.c_setEndpoint(signUpEmail, size)
      Cypress.env('citizenship', Cypress.env('dielCountry'))
      cy.c_demoAccountSignup(country, signUpEmail, size)
      cy.c_checkTradersHubHomePage(isMobile)
      cy.c_switchToReal()
      cy.findByText('EU', { exact: true }).click()
      if (isMobile)
        cy.findByText('EU').should(
          'have.class',
          'dc-tabs__item--is-scrollable-and-active'
        )
      else cy.findByText('EU').parent().should('have.class', 'is-selected')
      cy.findByRole('button', { name: 'Get a Deriv account' }).click()
      cy.c_generateRandomName().then((firstName) => {
        cy.c_personalDetails(
          firstName,
          'MF',
          country,
          nationalIDNum,
          taxIDNum,
          euCurrency,
          { isMobile: isMobile }
        )
      })
      cy.c_addressDetails()
      cy.c_completeTradingAssessment({
        isMobile: isMobile,
      })
      cy.c_completeFinancialAssessment({
        isMobile: isMobile,
      })
      cy.c_completeFatcaDeclarationAgreement()
      cy.c_addAccountMF('', { isMobile: isMobile })
      cy.c_closeNotificationHeader()
      cy.findByText('Non-EU', { exact: true }).click()
      if (isMobile)
        cy.findByText('Non-EU').should(
          'have.class',
          'dc-tabs__item--is-scrollable-and-active'
        )
      else cy.findByText('Non-EU').parent().should('have.class', 'is-selected')
      cy.findByRole('button', { name: 'Get a Deriv account' }).click()
      cy.findByText('US Dollar').click()
      cy.findByRole('button', { name: 'Next' }).click()
      if (isMobile) {
        cy.get(`select[name='document_type']`).select('National ID Number')
      } else {
        cy.findByLabelText('Choose the document type').click()
        cy.findByText('National ID Number').click()
      }
      cy.findByLabelText('Enter your document number').type(nationalIDNum)
      cy.get('.dc-checkbox__box').as('checkbox').click({ multiple: true })
      cy.findByRole('button', { name: 'Next' }).click()
      cy.findByRole('button', { name: 'Next' }).click()
      cy.c_addAccount()
      cy.c_manageAccountsetting(country, { isMobile: isMobile })
    })
  })
})
