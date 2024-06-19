import { generateEpoch } from '../../../support/helper/utility'

describe('QATEST-5554: Verify DIEL Signup flow - CR', () => {
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
      cy.findByText('Add a Deriv account').should('be.visible')
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
      cy.c_addressDetails()
      cy.c_completeFatcaDeclarationAgreement()
      cy.c_addAccount({ isMobile: isMobile })
      cy.c_closeNotificationHeader()
      cy.c_checkTradersHubHomePage(isMobile)
      cy.findByText('Regulation:').should('not.exist')
      cy.findByText('Non-EU').should('not.exist')
      cy.findByText('EU').should('not.exist')
      cy.c_manageAccountsetting(country, { isMobile: isMobile })
    })
  })
})
