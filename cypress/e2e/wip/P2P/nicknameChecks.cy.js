import '@testing-library/cypress/add-commands'

let longNickname = 'thisnicknamewillnotfitatall'
let shortNickname = 'a'
let specialCharactersNickname = 'n!cKn@me'
let repetitiveCharactersNickname = 'haaaaaaaaaary'
let duplicateNickname = ''

function clearNicknameField(){
    cy.findByRole('textbox', { name: 'Your nickname' }).clear()
    cy.findByText('Nickname is required').should('be.visible')
}


describe("QATEST-2292 - Register a new client as an Advertiser in Deriv P2P - Nickname checks", () => {
    beforeEach(() => {
        cy.c_login()
        cy.c_visitResponsive('/cashier/p2p', 'small')
    })

    it('Should be able to check for field validation checks for nickname.', () => {
        cy.c_closeSafetyInstructions()
        cy.findByText('Deriv P2P').should('exist')
        cy.c_closeNotificationHeader()
        cy.findByText('My profile').click()
        cy.findByRole('heading', { name: 'What’s your nickname?' }).should('be.visible')
        cy.findByText('Others will see this on your profile, ads, and chats.').should('be.visible')
        cy.findByText('Your nickname cannot be changed later.').should('be.visible')
        cy.findByRole('textbox', { name: 'Your nickname' }).should('exist').type(longNickname)
        cy.findByText('Nickname is too long').should('be.visible')
        cy.findByRole('button', { name: 'Confirm' }).should('be.disabled')
        clearNicknameField()

        cy.findByRole('textbox', { name: 'Your nickname' }).should('exist').type(shortNickname)
        cy.findByText('Nickname is too short').should('be.visible')
        cy.findByRole('button', { name: 'Confirm' }).should('be.disabled')
        clearNicknameField()

        cy.findByRole('textbox', { name: 'Your nickname' }).should('exist').type(specialCharactersNickname)
        cy.findByText('Can only contain letters, numbers, and special characters .- _ @.').should('be.visible')
        cy.findByRole('button', { name: 'Confirm' }).should('be.disabled')
        clearNicknameField()

        cy.findByRole('textbox', { name: 'Your nickname' }).should('exist').type(repetitiveCharactersNickname)
        cy.findByText('Nickname is too long').should('be.visible')
        cy.findByRole('button', { name: 'Confirm' }).should('be.disabled')
        clearNicknameField()

        cy.findByRole('textbox', { name: 'Your nickname' }).should('exist').type(duplicateNickname)
        cy.findByText('Nickname is too long').should('be.visible')
        cy.findByRole('button', { name: 'Confirm' }).should('be.disabled')
        clearNicknameField()
        

    })
})