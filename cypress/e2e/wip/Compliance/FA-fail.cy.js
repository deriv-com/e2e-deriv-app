import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/helper/utility'

describe('QATEST-5168 MF financial assessment (Appropriateness Test) - Fail scenario but successful account creation', () => {
  const size = ['small', 'desktop']
  let country = Cypress.env('countries').ES
  let nationalIDNum = Cypress.env('nationalIDNum').ES
  let taxIDNum = Cypress.env('taxIDNum').ES
  let currency = Cypress.env('accountCurrency').USD

  size.forEach((size) => {
    it(`Check FA on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      const signUpEmail = `sanity${generateEpoch()}mf@deriv.com`
      cy.c_setEndpoint(signUpEmail, size)
      cy.c_demoAccountSignup(country, signUpEmail, size)
      cy.c_generateRandomName().then((firstName) => {
        cy.c_personalDetails(
          firstName,
          'MF',
          country,
          nationalIDNum,
          taxIDNum,
          currency,
          { isMobile: isMobile }
        )
      })
      cy.c_addressDetails()
      //1st question
      cy.findByRole('heading', {
        name: 'Do you understand that you could potentially lose 100% of the money you use to trade?',
      }).should('be.visible')
      cy.findByText('Yes').click()
      cy.findByRole('button', { name: 'Next' }).click()
      //2nd question
      cy.findByRole('heading', {
        name: 'How much knowledge and experience do you have in relation to online trading?',
      }).should('be.visible')
      cy.findByText(
        'I am interested in trading but have very little experience.'
      ).click()
      cy.findByRole('button', { name: 'Next' }).click()

      if (isMobile) {
        cy.get(`select[name='cfd_experience']`).select('No experience')
        cy.get(`select[name='cfd_frequency']`).select('None')
        cy.get(
          `select[name='trading_experience_financial_instruments']`
        ).select('No experience')
        cy.get(`select[name='trading_frequency_financial_instruments']`).select(
          'None'
        )
      } else {
        let count = 1
        while (count < 5) {
          cy.findAllByTestId('dt_dropdown_display').eq(count).click()
          cy.findAllByTestId('dti_list_item').eq(0).click()
          count++
        }
      }
      cy.findByRole('button', { name: 'Next' }).click()
      //4th question
      cy.findByRole('heading', {
        name: 'In your understanding, CFD trading allows you to',
      }).should('be.visible')
      cy.findByText(
        'Make a long-term investment for a guaranteed profit.'
      ).click()
      cy.findByRole('button', { name: 'Next' }).click()
      //5th question
      cy.findByRole('heading', {
        name: 'How does leverage affect CFD trading?',
      }).should('be.visible')
      cy.findByText(
        'Leverage prevents you from opening large positions.'
      ).click()
      cy.findByRole('button', { name: 'Next' }).click()
      //6th question
      cy.findByRole('heading', {
        name: "Leverage trading is high-risk, so it's a good idea to use risk management features such as stop loss. Stop loss allows you to",
      }).should('be.visible')
      cy.findByText(
        'Cancel your trade at any time within a specified timeframe.'
      ).click()
      cy.findByRole('button', { name: 'Next' }).click()
      //7th question
      cy.findByRole('heading', {
        name: 'When are you required to pay an initial margin?',
      }).should('be.visible')
      cy.findByText('When trading multipliers.').click()
      cy.findByRole('button', { name: 'Next' }).click()

      if (isMobile) {
        cy.c_completeFinancialAssessment({ isMobile: true })
      } else {
        cy.c_completeFinancialAssessment({})
      }
      cy.c_completeFatcaDeclarationAgreement()
      cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
      cy.get('.dc-checkbox__box').eq(0).click()
      cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
      cy.get('.dc-checkbox__box').eq(1).click()
      cy.get('.dc-checkbox__box').eq(2).click()
      cy.findByRole('button', { name: 'Add account' }).click()
      cy.findByText('Appropriateness Test Warning').should('be.visible')
      cy.findByRole('button', { name: 'Accept' }).click()
      cy.get('#traders-hub').scrollIntoView({ position: 'top' })
    })
  })
})
