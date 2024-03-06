import '@testing-library/cypress/add-commands'

describe("QATEST-2871 - Block and unblock user from advertisers Profile pag", () => {
    beforeEach(() => {
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'small')
    })

    it('Should be able to block the advertiser from profile page.', () => {
        cy.c_navigateToDerivP2P()
        cy.findByText('Deriv P2P').should('exist')
        cy.c_closeNotificationHeader()
        cy.findByText('No ads for this currency at the moment 😞').should('not.exist')
        cy.get('div[class="buy-sell__cell--container__row"]').first().click()
        cy.findByText("Advertiser's page").should('exist')
        cy.findByTestId('dt_page_return').next().click()
    })
})