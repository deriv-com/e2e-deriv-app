import '@testing-library/cypress/add-commands'
let paymentMethod = null;

describe("P2P - Edit Payment Methods", () => {
    beforeEach(() => {
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'small')
        //        cy.fixture('cypress/e2e/wip/P2P/fixture/paymentMethodsWithData.json').as('paymentMethodAndData')
    })

    it('should be able to edit the existing payment methods', () => {
        navigateToDerivP2P(); //Navigation to P2P Handler
        cy.findByText('Deriv P2P')
            .should('exist')
        closeNotificationHeader();
        navigateToTab('My profile');
        cy.get('div.my-profile-name')
            .should('be.visible')
        cy.contains('div.my-profile-stats__navigation span', 'Payment methods').click()
        cy.contains('p.dc-text', 'Payment methods')
            .should('be.visible')
        // Get first payment type available on the screen
        cy.get('span.payment-methods-list__list-header').first().invoke('text').then((value) => {
            paymentMethod = value.trim(); //Will only get either of the three: Bank Transfers, E-wallets, Others
            cy.log("Payment type available: " + paymentMethod);
            cy.contains('div.payment-methods-list__list-container span', paymentMethod).next().within(() => {
                cy.get('[data-testid="dt_dropdown_display"] svg').eq(0).click()
            })
            cy.get('#edit')
                .should('be.visible')
                .click()
            editPaymentMethod(paymentMethod);
        });
    })
})

function editPaymentMethod(paymentMethod) {
    if (paymentMethod == "Bank Transfers") {
        cy.log("Bank Transfer Block")
        const accountNumberString = generateAccountNumberString(12);
        cy.get('input[aria-label="Account Number"]')
            .clear()
            .type(accountNumberString)
            .should('have.value', accountNumberString)

        cy.get('input[aria-label="SWIFT or IFSC code"]')
            .clear()
            .type('9087')
            .should('have.value', '9087')

        cy.get('input[aria-label="Bank Name"]')
            .clear()
            .type('Bank Alfalah TG')
            .should('have.value', 'Bank Alfalah TG')

        cy.get('input[aria-label="Branch"]')
            .clear()
            .type('Branch number 42')
            .should('have.value', 'Branch number 42')

        cy.get('textarea[name="instructions"]')
            .clear()
            .type('This block is for giving instruction')
            .should('have.value', 'This block is for giving instruction')

        cy.get('button[type="submit"]')
            .should('not.be.disabled')
            .click();

        cy.contains('p.dc-text', 'Payment methods')
            .should('be.visible')

        cy.contains('span.dc-text', 'Bank Alfalah TG')
            .should('be.visible')

        cy.contains('span.dc-text', accountNumberString)
            .should('be.visible')

    } else if (paymentMethod == "E-wallets") {
        cy.log("Wallets Block")
        cy.get('input[name="choose_payment_method"]').invoke('val').then((text) => {
            cy.log('Payment Method: ' + text);
        });
        const accountNumberString = generateAccountNumberString(12);
        cy.get('input[name="account"]')
            .clear()
            .type(accountNumberString)
            .should('have.value', accountNumberString)

        cy.get('textarea[name="instructions"]')
            .clear()
            .type('This block is for giving instruction')
            .should('have.value', 'This block is for giving instruction')

        cy.get('button[type="submit"]')
            .should('not.be.disabled')
            .click();

        cy.contains('p.dc-text', 'Payment methods')
            .should('be.visible')

        cy.contains('span.dc-text', accountNumberString)
            .should('be.visible')

    } else if (paymentMethod == "Others") {
        cy.log("Others Block")
        const accountNumberString = generateAccountNumberString(12);
        cy.get('input[aria-label="Account ID / phone number / email"]')
            .clear()
            .type(accountNumberString)
            .should('have.value', accountNumberString)

        cy.get('textarea[name="instructions"]')
            .clear()
            .type('This block is for instruction')
            .should('have.value', 'This block is for instruction')

        cy.get('input[aria-label="Payment method name"]')
            .clear()
            .type('Xenos1')
            .should('have.value', 'Xenos1')

        cy.get('button[type="submit"]')
            .should('not.be.disabled')
            .click();

        cy.contains('p.dc-text', 'Payment methods')
            .should('be.visible')

        cy.contains('span.dc-text', 'Xenos1')
            .should('be.visible')

        cy.contains('span.dc-text', accountNumberString)
            .should('be.visible')
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
    cy.contains('div[data-testid="dt_themed_scrollbars"] li', tabName).click({ force: true })
}

function generateAccountNumberString(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}