import '@testing-library/cypress/add-commands'
let paymentMethod = null;

describe("P2P - Edit Payment Methods", () => {
    beforeEach(() => {
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'small')
    })

    it('should be able to edit the existing payment methods', () => {
        navigateToDerivP2P(); //Navigation to P2P Handler
        closeNotificationHeader();
        navigateToTab('My profile');
        cy.contains('div.my-profile-stats__navigation span', 'Payment methods').click()
        // Get first payment type available on the screen
        cy.get('span.payment-methods-list__list-header').first().invoke('text').then((value) => {
            paymentMethod = value.trim(); //Will only get either of the three: Bank Transfers, E-wallets, Others
            cy.log("Payment type available: " + paymentMethod);
            //cy.get('span.payment-methods-list__list-header:contains("' + paymentMethod + '") + div > div > div.payment-method-card__header > div > div > div > svg')
            cy.contains('div.payment-methods-list__list-container span', paymentMethod).next().within(()=>{
                cy.get('[data-testid="dt_dropdown_display"] svg').eq(0).click()
            })
        });
        //editPaymentMethod(paymentMethod)
    })
})

function editPaymentMethod(paymentMethod){
    //Get Payment Method Type:
    
    if(paymentMethod == "Bank Transfers"){

    }
}

function navigateToDerivP2P() {
    cy.get('#dt_mobile_drawer_toggle')
        .should('be.visible')
        .click()

        cy.contains('div.dc-mobile-drawer__submenu-toggle h3', "Cashier")
        .should('be.visible')
        .contains('Cashier')
        .click()

        cy.contains('h3', "Deriv P2P")
        .should('be.visible')
        .contains('Deriv P2P')
        .click()

    cy.get('.dc-modal-header__title').should('be.visible').then(($title) => {
        if ($title.is(':visible')) {
            cy.get('.dc-checkbox__box')
                .should('be.visible')
                .click()
        } else {
            cy.log('Title is not visible, breaking from the else');
        }
    })
    cy.get('[data-testid="dt_modal_footer"] > .dc-btn')
        .should('be.visible')
        .click()
}

function closeNotificationHeader() {
    cy.document().then(doc => {
        let notification = doc.querySelector('.notification__header')
        if (notification && notification != undefined && notification != null) {
            cy.log('Notification header appeared')
            cy.get('.notification__text-body').invoke('text').then((text) => {
                cy.log(text);
            });
            cy.get('.notification__close-button')
                .should('be.visible')
                .click()
            cy.get('.notification__header')
                .should('not.exist')
            notification = null;
            cy.wait(2000)
            closeNotificationHeader()
        }
        else {
            cy.log('Notification header did not appear')
        }
    })
}

function navigateToTab(tabName) {
    cy.contains('div[data-testid="dt_themed_scrollbars"] li', tabName).click({force:true})
}