import '@testing-library/cypress/add-commands'

describe('QATEST-24444 - Verify the user is able to close the personal details pop up during sign up', () => {
  const size = ['small', 'desktop']
  let countryCode = 'co'

  before(() => {
    cy.c_createDemoAccount(countryCode)
  })
  beforeEach(() => {
    cy.c_login()
  })
  size.forEach((size) => {
    it(`Should validate the pop up functionality when user closes the personal details section  on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('appstore/traders-hub', size)
      //Wait for page to completely load
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
      if (isMobile) cy.c_skipPasskeysV2()
      cy.findByText('Add a Deriv account').should('be.visible')
      cy.findByText('US Dollar').click()
      cy.findByRole('button', { name: 'Next' }).click()
      if (isMobile) cy.findByTestId('dt_dc_mobile_dialog_close_btn').click()
      else cy.findByTestId('dt_modal_close_icon').click()
      cy.findByText('Stop creating an account?').should('be.visible')
      cy.findByText(
        'If you hit Yes, the info you entered will be lost.'
      ).should('be.visible')
      cy.findByRole('button', { name: 'No' }).click()
      if (isMobile)
        cy.findByText('Step 2: Personal details (2 of 4)').should('be.visible')
      else cy.findByText('Complete your personal details').should('be.visible')
      if (isMobile) cy.findByTestId('dt_dc_mobile_dialog_close_btn').click()
      else cy.findByTestId('dt_modal_close_icon').click()
      cy.findByRole('button', { name: 'Yes' }).click()
      cy.url().should(
        'be.equal',
        Cypress.env('baseUrl') + 'appstore/traders-hub'
      )
      cy.findByTestId('dt_trading-app-card_real_deriv-account')
        .findByRole('button', { name: 'Get' })
        .should('be.enabled')
    })
  })
})
