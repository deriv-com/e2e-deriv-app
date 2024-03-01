import '@testing-library/cypress/add-commands'

export function navigateToDerivP2P() {
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

export function closeNotificationHeader() {
    cy.document().then(doc => {
        let notification = doc.querySelector('.notification__header')
        if (notification) {
            cy.log('Notification header appeared')
            cy.get('.notification__text-body').invoke('text').then((text) => {
                cy.log(text)
            })
            cy.findByRole('button', { name: 'Close' }).should('be.visible').click().and('not.exist')
            notification = null
            cy.then(() => {closeNotificationHeader()})
        }
        else {
            cy.log('Notification header did not appear')
        }
    })
}