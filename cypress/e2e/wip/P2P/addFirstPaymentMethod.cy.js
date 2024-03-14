import '@testing-library/cypress/add-commands'
import { generateAccountNumberString } from '../../../support/p2p'

let paymentName = 'PayPal'
let paymentID = generateAccountNumberString(12)

describe('QATEST-2821 - My Profile page : User add their first payment method', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/cashier/p2p', 'small')
  })

  it('Should be able to add first payment method in responsive mode.', () => {
    cy.c_closeSafetyInstructions()
    cy.findByText('Deriv P2P').should('exist')
    cy.c_closeNotificationHeader()
    cy.findByText('My profile').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    cy.findByText('Payment methods').should('be.visible').click()
    cy.findByText('Payment methods').should('be.visible')
    cy.c_deleteAllPM()
    cy.findByText('You haven’t added any payment methods yet').should(
      'be.visible'
    )
    cy.findByRole('button', { name: 'Add payment methods' })
      .should('be.visible')
      .click()
    cy.c_addPaymentMethod(paymentID, paymentName)
  })
})
