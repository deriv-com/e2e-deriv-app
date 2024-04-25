import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/helper/utility'

const regulationText = '.regulators-switcher__switch div.item.is-selected'

describe('QATEST-6211: Verify DIEL Signup flow - MF + CR', () => {
  let size = ['small', 'desktop']
  let country = Cypress.env('countries').ZA
  let nationalIDNum = Cypress.env('nationalIDNum').ZA
  let taxIDNum = Cypress.env('taxIDNum').ZA
  let euCurrency = Cypress.env('accountCurrency').EUR

  size.forEach((size) => {
    it(`Verify I can signup for a DIEL demo and real account on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const signUpEmail = `sanity${generateEpoch()}dielmfcr@deriv.com`
      cy.c_setEndpoint(signUpEmail, size)
      Cypress.env('citizenship', Cypress.env('dielCountry'))
      cy.c_demoAccountSignup(country, signUpEmail, size)
      cy.c_checkTradersHubHomePage()
      cy.findByTestId('dt_dropdown_display').click()
      cy.get('#real').click()
      cy.findByText('EU', { exact: true }).click()
      cy.get(regulationText).should('have.text', 'EU')
      cy.findByRole('button', { name: 'Get a Deriv account' }).click()
      cy.c_generateRandomName().then((firstName) => {
        cy.c_personalDetails(
          firstName,
          'MF',
          country,
          nationalIDNum,
          taxIDNum,
          euCurrency,
          { isMobile: size == 'small' ? true : false }
        )
      })
      cy.c_addressDetails()
      cy.c_completeTradingAssessment()
      cy.c_completeFinancialAssessment()
      cy.c_completeFatcaDeclarationAgreement()
      cy.c_addAccountMF()
      cy.findByText('Non-EU', { exact: true }).click()
      cy.get(regulationText).should('have.text', 'Non-EU')
      cy.findByRole('button', { name: 'Get a Deriv account' }).click()
      cy.findByText('US Dollar').click()
      cy.findByRole('button', { name: 'Next' }).click()
      cy.findByLabelText('Choose the document type').click()
      cy.findByText('National ID Number').click()
      cy.findByLabelText('Enter your document number').type(nationalIDNum)
      cy.get('.dc-checkbox__box').as('checkbox').click({ multiple: true })
      cy.findByRole('button', { name: 'Next' }).click()
      cy.findByRole('button', { name: 'Next' }).click()
      cy.c_addAccount()
      cy.c_manageAccountsetting(country)
    })
  })
})
