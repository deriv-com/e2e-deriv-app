import '@testing-library/cypress/add-commands'

let paymentName = 'Bank Al Habeeb'
let additionalPaymentName = 'Grand Turismo'
let paymentID = generateAccountNumberString(12)

function navigateToTab(tabName) {
    cy.findByText(tabName).click()
}

function setText(fieldName, fieldText) {
    cy.findByRole('textbox', { name: fieldName }).clear().type(fieldText).should('have.value', fieldText)
}

function generateAccountNumberString(length) {
    let result = ''
    const characters = '0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

function deletePaymentMethod() {
    cy.findByText(paymentID).should('exist').parent().prev().find('.dc-dropdown-container').and('exist').click()
    cy.get('#delete').should('be.visible').click()
    cy.findByText(`Delete ${paymentName}?`).should('be.visible')
    cy.findByRole('button', { name: 'Yes, remove' }).should('be.visible').click()
    cy.findByText(paymentID).should('not.exist')
}

function addPaymentMethod() {
    setText('Payment method', 'Bank')
    cy.findByText('Bank Transfer').click()
    setText('Account Number', paymentID)
    setText('SWIFT or IFSC code', '9087')
    setText('Bank Name', paymentName)
    setText('Branch', 'Branch number 42')
    cy.get('textarea[name="instructions"]').type('Follow instructions.').should('have.value', 'Follow instructions.')
    cy.findByRole('button', { name: 'Add' }).should('not.be.disabled').click()
    cy.findByText('Payment methods').should('be.visible')
    cy.findByText(paymentID).should('be.visible')
}

describe("QATEST-2811 My profile page : User with existing payment method add new payment method", () => {
    beforeEach(() => {
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'small')
    })
    it('Should be able to add additional payment method in responsive mode.', () => {
        cy.c_navigateToDerivP2P()
        cy.findByText('Deriv P2P').should('exist')
        cy.c_closeNotificationHeader()
        navigateToTab('My profile')
        cy.findByText('Available Deriv P2P balance').should('be.visible')
        cy.findByText('Payment methods').should('be.visible').click()
        cy.findByText('Payment methods').should('be.visible')
        cy.findByRole('button').should('be.visible').and('contain.text', 'Add').click()
        addPaymentMethod()
        deletePaymentMethod()
    })
})