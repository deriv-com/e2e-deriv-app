import '@testing-library/cypress/add-commands'
import { generateAccountNumberString } from '../../../support/p2p'

let paymentID = generateAccountNumberString(12)
let additionalpaymentID = generateAccountNumberString(12)

describe("QATEST-2811 My profile page : User with existing payment method add new payment method", () => {
    beforeEach(() => {
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'small')
    })

    it('Should be able to add additional payment method in responsive mode.', () => {
        cy.c_navigateToDerivP2P()
        cy.c_closeSafetyInstructions()
        cy.findByText('Deriv P2P').should('exist')
        cy.c_closeNotificationHeader()
        cy.findByText('My profile').click()
        cy.findByText('Available Deriv P2P balance').should('be.visible')
        cy.findByText('Payment methods').should('be.visible').click()
        cy.findByText('Payment methods').should('be.visible')
        cy.findByRole('button').should('exist').and('contain.text', 'Add').click()
        cy.c_addPaymentMethod('Alipay', paymentID)
        cy.findByRole('button').should('exist').and('contain.text', 'Add').click()
        cy.c_addPaymentMethod('Other', additionalpaymentID)
        cy.c_deletePaymentMethod(paymentID, 'Alipay')
        cy.c_deletePaymentMethod(additionalpaymentID, 'EasyMoney')
    })
})