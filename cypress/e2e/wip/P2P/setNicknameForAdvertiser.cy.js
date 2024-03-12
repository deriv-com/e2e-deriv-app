import '@testing-library/cypress/add-commands'
import { generateAccountNumberString } from '../../../support/p2p'

let nickname = `NickWithAcc${generateAccountNumberString(5)}`

describe("QATEST-2292 - Register a new client as an Advertiser in Deriv P2P - Nickname checks", () => {
    beforeEach(() => {
        cy.c_login()
        cy.c_visitResponsive('/cashier/p2p', 'small')
    })

    it('Should be able to set a nickname for P2P in responsive mode.', () => {
        cy.c_closeSafetyInstructions()
        cy.findByText('Deriv P2P').should('exist')
        cy.c_closeNotificationHeader()
        cy.findByText('My profile').click()
        cy.findByRole('heading', { name: 'What’s your nickname?' }).should('be.visible')
        cy.findByText('Others will see this on your profile, ads, and chats.').should('be.visible')
        cy.findByText('Your nickname cannot be changed later.').should('be.visible')
        cy.findByRole('textbox', { name: 'Your nickname' }).should('exist').type(nickname)
        cy.findByRole('button', { name: 'Confirm' }).should('be.enabled').click()
        cy.findByText(nickname).should('be.visible')
    })
})