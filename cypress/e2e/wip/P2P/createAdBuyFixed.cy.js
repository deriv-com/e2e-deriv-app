import '@testing-library/cypress/add-commands'

let fixedRate = 1.25
let minOrder = 5
let maxOrder = 10
let fiatCurrency
let localCurrency

function validateMinMaxField(
    selector,
    expectedValue,
    expectedValidation,
    totalAmount
) {
    cy.findByTestId(selector).type('abc').should('have.value', 'abc')
    cy.findByText('Only numbers are allowed.').should('be.visible')
    cy.findByTestId(selector)
        .clear()
        .type('123abc')
        .should('have.value', '123abc')
    cy.findByText('Only numbers are allowed.').should('be.visible')
    cy.findByTestId(selector).clear().type('!@#').should('have.value', '!@#')
    cy.findByText('Only numbers are allowed.').should('be.visible')
    cy.findByTestId(selector)
        .clear()
        .type('1234567890123456')
        .should('have.value', '123456789012345')
    cy.findByTestId(selector).clear()
    cy.findByText(`${expectedValidation} limit is required`).should('be.visible')
    cy.findByTestId(selector).type(11)
    cy.findByText(
        `Amount should not be below ${expectedValidation} limit`
    ).should('be.visible')
    cy.findByText(`${expectedValidation} limit should not exceed Amount`).should(
        'be.visible'
    )
    cy.findByTestId(selector)
        .clear()
        .type(expectedValue)
        .should('have.value', expectedValue)
}

function verifyAdOnMyAdsScreen() {
    cy.findByText('Active').should('be.visible')
    cy.findByText(`Buy ${fiatCurrency}`).should('be.visible')
    cy.findByText(`${fixedRate} ${localCurrency}`)
    cy.findByText(
        `${minOrder.toFixed(2)} - ${maxOrder.toFixed(2)} ${fiatCurrency}`
    )
}

describe('QATEST-2403 - Create a Buy type Advert - Floating Rate', () => {
    beforeEach(() => {
        cy.clearAllSessionStorage()
        cy.c_login()
        cy.c_visitResponsive('/cashier/p2p', 'small')
    })

    it('Should be able to create buy type advert and verify all fields and messages for fixed rate.', () => {
        cy.c_closeSafetyInstructions()
        cy.findByText('Deriv P2P').should('exist')
        cy.c_closeNotificationHeader()
        cy.c_clickMyAdTab()
        cy.c_createNewAd()
        cy.findByTestId('offer_amount')
            .next('span.dc-text')
            .invoke('text')
            .then((fiatCurrency) => {
                const fiat = fiatCurrency.trim()
                sessionStorage.setItem('c_fiatCurrency', fiat)
            })
        cy.findByTestId('fixed_rate_type')
            .next('span.dc-text')
            .invoke('text')
            .then((localCurrency) => {
                const local = localCurrency.trim()
                sessionStorage.setItem('c_localCurrency', local)
            })
        cy.then(() => {
            cy.log(sessionStorage.getItem('c_fiatCurrency'))
            cy.log(sessionStorage.getItem('c_localCurrency'))
            cy.c_verifyAmountFiled()
            cy.c_verifyFixedRate(
                10,
                fixedRate,
                sessionStorage.getItem('c_fiatCurrency'),
                sessionStorage.getItem('c_localCurrency')
            )
            validateMinMaxField('min_transaction', minOrder, 'Min', 10)
            validateMinMaxField('max_transaction', maxOrder, 'Max', 10)
            cy.c_verifyTooltip()
            cy.c_verifyCompletionOrderDropdown()
            cy.c_PaymentMethod()
            cy.c_verifyPostAd()
            verifyAdOnMyAdsScreen()
        })
    })
})
