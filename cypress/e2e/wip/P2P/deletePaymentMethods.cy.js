import '@testing-library/cypress/add-commands'
import { navigateToDerivP2P, closeNotificationHeader } from '../P2P/support/common'

let paymentMethod = null
let paymentName = null

function navigateToTab(tabName) {
    cy.findByText(tabName).click()
}

function deletePaymentMethod() {
    cy.get('div.payment-method-card__body span').each(($span, index) => {
        const value = $span.text().trim();
        if (value !== '') {
            paymentName = value;
            cy.log("Payment Name - " + paymentName);
            cy.findAllByTestId('dt_dropdown_display').first().click();
            cy.get('#delete').should('be.visible').click();
            cy.get('div[class="dc-modal-header"]', { withinSubject: null }).should('be.visible').and('exist').contains(`Delete ${paymentName}?`);
            cy.get('div.dc-modal-footer button', { withinSubject: null}).first().should('be.visible').and('have.text', 'Yes, remove').click()
            cy.findByText(paymentName).should('not.visible')
            return false
        }
    })
}

describe("QATEST-2839 - My Profile page - Delete Payment Method", () => {
    beforeEach(() => {
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'small')
    })

    it('Should be able to delete the existing payment method in responsive mode.', () => {
        navigateToDerivP2P() //Navigation to P2P Handler
        cy.findByText('Deriv P2P').should('exist')
        closeNotificationHeader()
        navigateToTab('My profile')
        cy.findByText('Available Deriv P2P balance').should('be.visible') //verifes from a page text after navigating to my profile tab
        cy.findByText('Payment methods').should('be.visible').click()
        cy.findByText('Payment methods').should('be.visible') //verifies that Payment methods heading page is visible after clicking on Payment Methods
        // Get first payment type available on the screen
        cy.get('span.payment-methods-list__list-header').first().invoke('text').then((value) => {
            paymentMethod = value.trim() //Will only get either of the three: Bank Transfers, E-wallets, Others
            cy.log("Payment type available: " + paymentMethod)
            cy.contains('div.payment-methods-list__list-container span', paymentMethod).next().within(() => {
                deletePaymentMethod()
            })
            
        })
    })
})