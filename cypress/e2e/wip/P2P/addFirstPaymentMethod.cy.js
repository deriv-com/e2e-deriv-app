import '@testing-library/cypress/add-commands'
import { generateAccountNumberString } from '../../../support/p2p'

let paymentName = 'Bank Alfalah TG'
let paymentID = generateAccountNumberString(12)

describe("QATEST-2821 - My Profile page : User add their first payment method", () => {
    beforeEach(() => {
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'small')
    })
    it('Should be able to add first payment method in responsive mode.', () => {
        cy.c_navigateToDerivP2P()
        cy.findByText('Deriv P2P').should('exist')
        cy.c_closeNotificationHeader()
        cy.findByText('My profile').click()
        cy.findByText('Available Deriv P2P balance').should('be.visible')
        cy.findByText('Payment methods').should('be.visible').click()
        cy.findByText('Payment methods').should('be.visible')
        cy.findByText('You haven’t added any payment methods yet').should('be.visible')
        cy.findByRole('button', { name: 'Add payment methods' }).should('be.visible').click()
        cy.c_addPaymentMethod(paymentID, paymentName)
        cy.c_deletePaymentMethod(paymentID, paymentName)
        cy.findByText('You haven’t added any payment methods yet').should('be.visible')
    })
})