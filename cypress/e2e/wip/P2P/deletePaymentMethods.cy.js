import '@testing-library/cypress/add-commands'
import { generateAccountNumberString } from '../../../support/helper/utility'

let paymentName = 'Skrill'
let paymentID = generateAccountNumberString(12)

describe('QATEST-2839 - My Profile page - Delete Payment Method', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('Should be able to delete the existing payment method in responsive mode.', () => {
    cy.c_navigateToDerivP2P()
    cy.c_closeSafetyInstructions()
    cy.findByText('Deriv P2P').should('exist')
    cy.c_closeNotificationHeader()
    cy.findByText('My profile').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    cy.findByText('Payment methods').should('be.visible').click()
    cy.findByText('Payment methods').should('be.visible')
    cy.findByRole('button')
      .should('be.visible')
      .and('contain.text', 'Add')
      .click()
    cy.c_addPaymentMethod(paymentID, paymentName)
    cy.c_deletePaymentMethod(paymentID, paymentName)
  })
})
