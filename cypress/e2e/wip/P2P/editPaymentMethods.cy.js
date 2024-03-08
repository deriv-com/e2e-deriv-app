import '@testing-library/cypress/add-commands'
import { generateAccountNumberString } from '../../../support/p2p'

let paymentName = 'Bank Transfer'
let paymentID = generateAccountNumberString(12)
let newAccountNumberString = generateAccountNumberString(12)

function savePaymentDetailsAndVerify(newAccountNumberString) {
    cy.findByRole('button', { name: 'Save changes' }).should('not.be.disabled').click()
    cy.findByText('Payment methods').should('be.visible')
    cy.findByText(newAccountNumberString).should('be.visible')
}

function editPaymentMethod() {
    cy.findByRole('textbox', { name: 'Account Number' }).clear().type(newAccountNumberString).should('have.value', newAccountNumberString);
    cy.findByRole('textbox', { name: 'SWIFT or IFSC code' }).clear().type('23435').should('have.value', '23435');
    cy.findByRole('textbox', { name: 'Bank Name' }).clear().type('Bank Alfalah TG').should('have.value', 'Bank Alfalah TG');
    cy.findByRole('textbox', { name: 'Branch' }).clear().type('Branch number 42').should('have.value', 'Branch number 42');
    savePaymentDetailsAndVerify(newAccountNumberString)
}

describe("QATEST-2831 - My Profile page - Edit Payment Method", () => {
    beforeEach(() => {
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'small')
    })

    it('Should be able to edit the existing payment method in responsive mode.', () => {
        cy.c_navigateToDerivP2P()
        cy.c_closeSafetyInstructions()
        cy.findByText('Deriv P2P').should('exist')
        cy.c_closeNotificationHeader()
        cy.findByText('My profile').click()
        cy.findByText('Available Deriv P2P balance').should('be.visible')
        cy.findByText('Payment methods').should('be.visible').click()
        cy.findByText('Payment methods').should('be.visible')
        cy.findByRole('button').should('be.visible').and('contain.text', 'Add').click()
        cy.c_addPaymentMethod(paymentID, paymentName)
        cy.findByText(paymentID).should('exist').parent().prev().find('.dc-dropdown-container').and('exist').click()
        cy.get('#edit').should('be.visible').click()
        editPaymentMethod()
        cy.c_deletePaymentMethod(newAccountNumberString, 'Bank Alfalah TG')
    })
})