import '@testing-library/cypress/add-commands'
import { generateAccountNumberString } from '../../../support/p2p'

let paymentMethod = null

function savePaymentDetailsAndVerify(accountNumberString) {
    cy.findByRole('button', { name: 'Save changes' }).should('not.be.disabled').click()
    cy.findByText('Payment methods').should('be.visible')
    cy.findByText(accountNumberString).should('be.visible')
}

function editPaymentMethod(paymentMethod) {
    if (paymentMethod == "Bank Transfers") {
        cy.log("Bank Transfer Block")
        const accountNumberString = generateAccountNumberString(12)
        cy.findByRole('textbox', { name: 'Account Number' }).clear().type(accountNumberString).should('have.value', accountNumberString);
        cy.findByRole('textbox', { name: 'SWIFT or IFSC code' }).clear().type('9087').should('have.value', '9087');
        cy.findByRole('textbox', { name: 'Bank Name' }).clear().type('Bank Alfalah TG').should('have.value', 'Bank Alfalah TG');
        cy.findByRole('textbox', { name: 'Branch' }).clear().type('Branch number 42').should('have.value', 'Branch number 42');
        savePaymentDetailsAndVerify(accountNumberString)

    } else if (paymentMethod == "E-wallets") {
        cy.log("Wallets Block")
        cy.get('input[name="choose_payment_method"]').invoke('val').then((text) => {
            cy.log('Payment Method: ' + text)
        })
        const accountNumberString = generateAccountNumberString(12)
        cy.get('input[name="account"]').clear().type(accountNumberString).should('have.value', accountNumberString)
        savePaymentDetailsAndVerify(accountNumberString)

    } else if (paymentMethod == "Others") {
        cy.log("Others Block")
        const accountNumberString = generateAccountNumberString(12)
        cy.findByLabelText('Account ID / phone number / email').clear().type(accountNumberString).should('have.value', accountNumberString);
        cy.findByLabelText('Payment method name').clear().type('Xenos Power').should('have.value', 'Xenos Power');
        savePaymentDetailsAndVerify(accountNumberString)
    }
}

describe("QATEST-2831 - My Profile page - Edit Payment Method", () => {
    beforeEach(() => {
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'small')
    })

    it('Should be able to edit the existing payment method in responsive mode.', () => {
        cy.c_navigateToDerivP2P()
        cy.findByText('Deriv P2P').should('exist')
        cy.c_closeNotificationHeader()
        cy.findByText('My profile').click()
        cy.findByText('Available Deriv P2P balance').should('be.visible')
        cy.findByText('Payment methods').should('be.visible').click()
        cy.findByText('Payment methods').should('be.visible')
        cy.get('span.payment-methods-list__list-header').first().invoke('text').then((value) => {
            paymentMethod = value.trim()
            cy.log("Payment type available: " + paymentMethod)
            cy.contains('div.payment-methods-list__list-container span', paymentMethod).next().within(() => {
                cy.findByTestId('dt_dropdown_display').first().click()
            })
            cy.get('#edit').should('be.visible').click()
            editPaymentMethod(paymentMethod)
        })
    })
})