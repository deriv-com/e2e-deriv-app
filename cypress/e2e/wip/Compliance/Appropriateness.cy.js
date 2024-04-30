import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/helper/utility'

describe('QATEST-5159 MF financial assessment (Appropriateness Test) - Pass scenario and successful account creation', () => {
  const signUpEmail = `sanity${generateEpoch()}mf@deriv.com`
  let country = Cypress.env('countries').ES
  let nationalIDNum = Cypress.env('nationalIDNum').ES
  let taxIDNum = Cypress.env('taxIDNum').ES
  let currency = Cypress.env('accountCurrency').USD

  beforeEach(() => {
    cy.c_setEndpoint(signUpEmail)
  })
  it('Should be successful', () => {
    cy.c_demoAccountSignup(country, signUpEmail)
    cy.c_generateRandomName().then((firstName) => {
      cy.c_personalDetails(
        firstName,
        'MF',
        country,
        nationalIDNum,
        taxIDNum,
        currency
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
      'I have an academic degree, professional certification, and/or work experience related to financial services.'
    ).click()
    cy.findByRole('button', { name: 'Next' }).click()
    //3rd question
    let count = 1
    while (count < 5) {
      cy.findAllByTestId('dt_dropdown_display').eq(count).click()
      cy.findAllByTestId('dti_list_item').eq(0).click()
      count++
    }
    cy.findByRole('button', { name: 'Next' }).click()
    //4th question
    cy.findByRole('heading', {
      name: 'In your understanding, CFD trading allows you to',
    }).should('be.visible')
    cy.findByText(
      'Speculate on the price movement of an asset without actually owning it.'
    ).click()
    cy.findByRole('button', { name: 'Next' }).click()
    //5th question
    cy.findByRole('heading', {
      name: 'How does leverage affect CFD trading?',
    }).should('be.visible')
    cy.findByText(
      'Leverage lets you open large positions for a fraction of trade value, which may result in increased profit or loss.'
    ).click()
    cy.findByRole('button', { name: 'Next' }).click()
    //6th question
    cy.findByRole('heading', {
      name: "Leverage trading is high-risk, so it's a good idea to use risk management features such as stop loss. Stop loss allows you to",
    }).should('be.visible')
    cy.findByText(
      'Close your trade automatically when the loss is equal to or more than a specified amount, as long as there is adequate market liquidity.'
    ).click()
    cy.findByRole('button', { name: 'Next' }).click()
    //7th question
    cy.findByRole('heading', {
      name: 'When are you required to pay an initial margin?',
    }).should('be.visible')
    cy.findByText('When opening a leveraged CFD trade.').click()
    cy.findByRole('button', { name: 'Next' }).click()

    cy.c_completeFinancialAssessment()
    cy.c_completeFatcaDeclarationAgreement()
    cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
    cy.get('.dc-checkbox__box').eq(0).click()
    cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
    cy.get('.dc-checkbox__box').eq(1).click()
    cy.get('.dc-checkbox__box').eq(2).click()
    cy.findByRole('button', { name: 'Add account' }).click()

    cy.get('#traders-hub').scrollIntoView({ position: 'top' })
    cy.findByText('Total assets').should('be.visible')
    cy.findByText('0.00').should('be.visible')
  })
})
