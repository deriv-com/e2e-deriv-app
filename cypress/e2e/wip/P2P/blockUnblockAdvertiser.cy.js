import '@testing-library/cypress/add-commands'

function blockProfile(userNickname) {
    cy.findAllByText(userNickname).first().should('be.visible').click()
    cy.findByText('Advertiser\'s page').should('exist')
    cy.findByText(userNickname).should('be.visible')
    cy.findByTestId('dt_page_return').next().click()
    cy.get('.advertiser-page-dropdown-menu').should('be.visible').click()
    cy.findByText(`Block ${userNickname}?`).should('be.visible')
    cy.findByRole('button', { name: 'Block' }).should('exist').click()
    cy.findByText(`You have blocked ${userNickname}.`).should('be.visible')
}

function unblockProfile(userNickname) {
    cy.findByRole('button', { name: 'Unblock' }).should('exist').click()
    cy.findByText(`Unblock ${userNickname}?`).should('be.visible')
    cy.findByTestId('dt_modal_footer').findByRole('button', { name: 'Unblock' }).should('exist').click()
    cy.findByText('Advertiser\'s page').should('exist')
    cy.findByText(userNickname).should('be.visible')
}

describe("QATEST-2871 - Block and unblock user from advertisers Profile pag", () => {
    beforeEach(() => {
        cy.c_login()
        cy.c_visitResponsive('/cashier/p2p', 'small')
    })

    it('Should be able to block the advertiser from profile page.', () => {
        cy.c_closeSafetyInstructions()
        cy.findByText('Deriv P2P').should('exist')
        cy.c_closeNotificationHeader()
        cy.get('.buy-sell-row__advertiser-name--text').first().invoke('text').then((userNickname) => {
            blockProfile(userNickname)
            unblockProfile(userNickname)
        })
    })
})