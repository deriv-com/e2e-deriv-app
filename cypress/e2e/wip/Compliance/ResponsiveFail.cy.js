import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/helper/utility'

describe('QATEST-5159 MF financial assessment (Appropriateness Test) - Pass scenario and successful account creation', () => {
  const size = ['small']
  const signUpEmail = `sanity${generateEpoch()}mf@deriv.com`
  let country = Cypress.env('countries').ES
  let nationalIDNum = Cypress.env('nationalIDNum').ES
  let taxIDNum = Cypress.env('taxIDNum').ES
  let currency = Cypress.env('accountCurrency').USD

  size.forEach((size) => {
    it(`MF Financial Assessment on ${size == 'small'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_setEndpoint(signUpEmail, size)
      Cypress.env('citizenship', country)
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
      //3rd question
      cy.get(`select[name='cfd_experience']`).select('No experience')
      cy.get(`select[name='cfd_frequency']`).select('None')
      cy.get(`select[name='trading_experience_financial_instruments']`).select(
        'No experience'
      )
      cy.get(`select[name='trading_frequency_financial_instruments']`).select(
        'None'
      )
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

      cy.c_completeFinancialAssessment({ isMobile: true })
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
      cy.findByText('Total assets').should('be.visible')
      cy.findByText('0.00').should('be.visible')
    })
  })
})
