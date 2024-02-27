import '@testing-library/cypress/add-commands'

let paymentMethod = null

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
        if (notification && notification != undefined && notification != null) {
            cy.log('Notification header appeared')
            cy.get('.notification__text-body').invoke('text').then((text) => {
                cy.log(text)
            })
            cy.findByRole('button', { name: 'Close' }).should('be.visible').click().and('not.exist')
            notification = null;
            cy.then(() => {closeNotificationHeader()})
        }
        else {
            cy.log('Notification header did not appear')
        }
    })
}

function savePaymentDetailsAndVerify(accountNumberString) {
    cy.findByRole('button', { name: 'Save changes' }).should('not.be.disabled').click()
    cy.findByText('Payment methods').should('be.visible')
    cy.findByText(accountNumberString).should('be.visible')
}

function navigateToTab(tabName) {
    cy.findByText(tabName).click()
}

function setText(fieldName, fieldTest) {
    cy.findByRole('textbox', { name: fieldName }).clear().type(fieldTest).should('have.value', fieldTest)
}

function generateAccountNumberString(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result;
}

function editPaymentMethod(paymentMethod) {
    if (paymentMethod == "Bank Transfers") {
        cy.log("Bank Transfer Block")
        const accountNumberString = generateAccountNumberString(12)
        setText('Account Number', accountNumberString)
        setText('SWIFT or IFSC code', '9087')
        setText('Bank Name', 'Bank Alfalah TG')
        setText('Branch', 'Branch number 42')
        cy.get('textarea[name="instructions"]').clear().type('This block is for giving instruction').should('have.value', 'This block is for giving instruction')
        savePaymentDetailsAndVerify(accountNumberString)

    } else if (paymentMethod == "E-wallets") {
        cy.log("Wallets Block")
        cy.get('input[name="choose_payment_method"]').invoke('val').then((text) => {
            cy.log('Payment Method: ' + text)
        })
        const accountNumberString = generateAccountNumberString(12)
        cy.findByRole('textbox', { name: 'Email or phone number' }).clear().type(accountNumberString).should('have.value', accountNumberString)
        cy.get('textarea[name="instructions"]').clear().type('This block is for giving instruction').should('have.value', 'This block is for giving instruction')
        savePaymentDetailsAndVerify(accountNumberString)

    } else if (paymentMethod == "Others") {
        cy.log("Others Block")
        const accountNumberString = generateAccountNumberString(12)
        cy.findByRole('textbox', { name: 'Account ID / phone number / email' }).clear().type(accountNumberString).should('have.value', accountNumberString)
        cy.get('textarea[name="instructions"]').clear().type('This block is for instruction').should('have.value', 'This block is for instruction')
        cy.findByRole('textbox', { name: 'Payment method name' }).clear().type('Xenos1').should('have.value', 'Xenos1')
        savePaymentDetailsAndVerify(accountNumberString)
    }
}

describe("QATEST-2831 - My Profile page - Edit Payment Method", () => {
    beforeEach(() => {
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'small')
    })

    it('should be able to edit the existing payment methods - responsive', () => {
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
                cy.get('[data-testid="dt_dropdown_display"] svg').eq(0).click()
            })
            cy.get('#edit').should('be.visible').click()
            editPaymentMethod(paymentMethod)
        })
    })
})
