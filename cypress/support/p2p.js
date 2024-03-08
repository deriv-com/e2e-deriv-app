Cypress.Commands.add('c_navigateToDerivP2P', () => {
    cy.get('#dt_mobile_drawer_toggle').should('be.visible').click()
    cy.findByRole('heading', { name: 'Cashier' }).should('be.visible').click()
    cy.findByRole('link', { name: 'Deriv P2P' }).should('be.visible').click()
})

Cypress.Commands.add('c_deleteAllPM', () => {
    cy.document().then(doc => {
        let paymentCard = doc.querySelector('.dc-dropdown__container')
        if (paymentCard) {
            cy.get('.dc-dropdown__container').first().click()
            cy.get('#delete').should('be.visible').click()
            cy.findByRole('button', { name: 'Yes, remove' }).should('be.visible').click().and('not.exist')
            paymentCard = null
            cy.then(() => { cy.c_deleteAllPM() })
        }
        else {
            cy.log('No PMs available')
        }
    })
})

Cypress.Commands.add('c_closeSafetyInstructions', () => {
    cy.findByRole('heading', { name: 'For your safety:' }).should('be.visible').then(($title) => {
        if ($title.is(':visible')) {
            cy.get('.dc-checkbox__box').should('be.visible').click()
        }
    })
    cy.findByRole('button', { name: 'Confirm' }).should('be.visible').click()
})

Cypress.Commands.add('c_closeNotificationHeader', () => {
    cy.document().then(doc => {
        let notification = doc.querySelector('.notification__header')
        if (notification) {
            cy.log('Notification header appeared')
            cy.get('.notification__text-body').invoke('text').then((text) => {
                cy.log(text)
            })
            cy.findByRole('button', { name: 'Close' }).should('be.visible').click().and('not.exist')
            notification = null
            cy.then(() => { cy.c_closeNotificationHeader() })
        }
        else {
            cy.log('Notification header did not appear')
        }
    })
})

Cypress.Commands.add('c_addPaymentMethod', (paymentID, paymentMethod) => {
    if (paymentMethod == 'Bank Transfer') {
        cy.findByRole('textbox', { name: 'Payment method' }).clear().type(paymentMethod).should('have.value', paymentMethod)
        cy.findByText(paymentMethod).click()
        cy.findByRole('textbox', { name: 'Account Number' }).clear().type(paymentID).should('have.value', paymentID)
        cy.findByRole('textbox', { name: 'SWIFT or IFSC code' }).clear().type('9087').should('have.value', '9087')
        cy.findByRole('textbox', { name: 'Bank Name' }).clear().type('Banking Name').should('have.value', 'Banking Name')
        cy.findByRole('textbox', { name: 'Branch' }).clear().type('Branch number 42').should('have.value', 'Branch number 42')
        cy.get('textarea[name="instructions"]').type('Follow instructions.').should('have.value', 'Follow instructions.')
        cy.findByRole('button', { name: 'Add' }).should('not.be.disabled').click()
        cy.findByText('Payment methods').should('be.visible')
        cy.findByText(paymentID).should('be.visible')
    } else if (paymentMethod === 'PayPal' || paymentMethod === 'WeChat Pay' || paymentMethod === 'Skrill' || paymentMethod === 'Alipay') {
        cy.findByRole('textbox', { name: 'Payment method' }).clear().type(paymentMethod).should('have.value', paymentMethod)
        cy.findByText(paymentMethod).click()
        cy.get('input[name="account"]').clear().type(paymentID).should('have.value', paymentID)
        cy.get('textarea[name="instructions"]').type('Follow instructions.').should('have.value', 'Follow instructions.')
        cy.findByRole('button', { name: 'Add' }).should('not.be.disabled').click()
        cy.findByText('Payment methods').should('be.visible')
        cy.findByText(paymentID).should('be.visible')
    } else if (paymentMethod == 'Other') {
        cy.findByRole('textbox', { name: 'Payment method' }).clear().type(paymentMethod).should('have.value', paymentMethod)
        cy.findByText(paymentMethod).click()
        cy.findByRole('textbox', { name: 'Account ID / phone number / email' }).clear().type(paymentID).should('have.value', paymentID)
        cy.findByRole('textbox', { name: 'Payment method name' }).clear().type('EasyMoney').should('have.value', 'EasyMoney')
        cy.get('textarea[name="instructions"]').type('Follow instructions.').should('have.value', 'Follow instructions.')
        cy.findByRole('button', { name: 'Add' }).should('not.be.disabled').click()
        cy.findByText('Payment methods').should('be.visible')
        cy.findByText(paymentID).should('be.visible')
    }
})

Cypress.Commands.add('c_deletePaymentMethod', (paymentID, paymentName) => {
    cy.findByText(paymentID).should('exist').parent().prev().find('.dc-dropdown-container').and('exist').click()
    cy.get('#delete').should('be.visible').click()
    cy.findByText(`Delete ${paymentName}?`).should('be.visible')
    cy.findByRole('button', { name: 'Yes, remove' }).should('be.visible').click()
    cy.findByText(paymentID).should('not.exist')
})

export const generateAccountNumberString = (length) => {
    let result = ''
    const characters = '0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}