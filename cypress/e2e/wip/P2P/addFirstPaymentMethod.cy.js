import '@testing-library/cypress/add-commands'

let paymentMethod = 'Bank Transfer'

function navigateToDerivP2P() {
    cy.get('#dt_mobile_drawer_toggle').should('be.visible').click()
    cy.findByRole('heading', { name: 'Cashier' }).should('be.visible').click()
    cy.findByRole('link', { name: 'Deriv P2P' }).should('be.visible').click()
    cy.findByRole('heading', { name: 'For your safety:' }).should('be.visible').then(($title) => {
        if ($title.is(':visible')) {
            cy.get('.dc-checkbox__box').should('be.visible').click()
        }
    })
    cy.findByRole('button', { name: 'Confirm' }).should('be.visible').click()
}

function closeNotificationHeader() {
    cy.document().then(doc => {
        let notification = doc.querySelector('.notification__header')
        if (notification) {
            cy.log('Notification header appeared')
            cy.get('.notification__text-body').invoke('text').then((text) => {
                cy.log(text)
            })
            cy.findByRole('button', { name: 'Close' }).should('be.visible').click().and('not.exist')
            notification = null
            cy.then(() => { closeNotificationHeader() })
        }
        else {
            cy.log('Notification header did not appear')
        }
    })
}

function savePaymentDetailsAndVerify(accountNumberString, accountBankName) {
    cy.findByRole('button', { name: 'Add' }).should('not.be.disabled').click()
    cy.findByText('Payment methods').should('be.visible')
    cy.findByText(accountNumberString).should('be.visible')
    cy.findByText(accountBankName).should('be.visible')
}

function navigateToTab(tabName) {
    cy.findByText(tabName).click()
}

function setText(fieldName, fieldText) {
    cy.findByRole('textbox', { name: fieldName }).clear().type(fieldText).should('have.value', fieldText)
}

function addFirstPaymentMethod() {
    setText('Account Number', '627438573856395')
    setText('SWIFT or IFSC code', '9087')
    setText('Bank Name', 'Bank Alfalah TG')
    setText('Branch', 'Branch number 42')
    cy.get('textarea[name="instructions"]').type('Follow instructions.').should('have.value', 'Follow instructions.')
    savePaymentDetailsAndVerify('627438573856395', 'Bank Alfalah TG')
}

describe("QATEST-2821 My Profile page : User add their first payment method", () => {
    beforeEach(() => {
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'small')
    })
    it('Should be able to add first payment method in responsive mode.', () => {
        navigateToDerivP2P()
        cy.findByText('Deriv P2P').should('exist')
        closeNotificationHeader()
        navigateToTab('My profile')
        cy.findByText('Available Deriv P2P balance').should('be.visible')
        cy.findByText('Payment methods').should('be.visible').click()
        cy.findByText('Payment methods').should('be.visible')
        cy.findByText('You haven’t added any payment methods yet').should('be.visible').and('exist')
        cy.findByRole('button', { name: 'Add payment methods' }).should('be.visible').click()
        cy.findByText('Add payment method').should('be.visible')
        setText('Payment method', paymentMethod)
        cy.findByText(paymentMethod).click()
        addFirstPaymentMethod()
    })
})