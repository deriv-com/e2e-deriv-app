import '@testing-library/cypress/add-commands'
import '../../../support/p2p'

let paymentMethod = null
let paymentName = null
let paymentID = null

function navigateToTab(tabName) {
    cy.findByText(tabName).click()
}

function deletePaymentMethod() {
    cy.get('div.payment-method-card__body span').each(($span, index) => {
        const value = $span.text().trim()
        if ((index === 0 || index === 1) && value !== '' && !paymentName) {
            paymentName = value
            return
        }
        if (value !== '') {
            paymentID = $span.text().trim()
            if (paymentName && paymentID) {
                cy.findAllByTestId('dt_dropdown_display').first().click()
                cy.get('#delete').should('be.visible').click()
                cy.get('div[class="dc-modal-header"]', { withinSubject: null }).should('be.visible').and('exist').contains(`Delete ${paymentName}?`)
                cy.get('div.dc-modal-footer button', { withinSubject: null }).first().should('be.visible').and('have.text', 'Yes, remove').click()
                cy.get(`span:contains(${paymentID})`, { withinSubject: null }).should('not.exist')
            }
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
        cy.c_navigateToDerivP2P()
        cy.findByText('Deriv P2P').should('exist')
        cy.c_closeNotificationHeader()
        navigateToTab('My profile')
        cy.findByText('Available Deriv P2P balance').should('be.visible')
        cy.findByText('Payment methods').should('be.visible').click()
        cy.findByText('Payment methods').should('be.visible')
        cy.get('span.payment-methods-list__list-header').first().invoke('text').then((value) => {
            paymentMethod = value.trim() //Will only get either of the three: Bank Transfers, E-wallets, Others
            cy.log("Payment type available: " + paymentMethod)
            cy.contains('div.payment-methods-list__list-container span', paymentMethod).next().within(() => {
                deletePaymentMethod()
            })
        })
    })
})