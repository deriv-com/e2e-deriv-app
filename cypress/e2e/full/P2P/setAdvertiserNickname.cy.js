import { generateAccountNumberString } from '../../../support/helper/utility'

let longNickname = 'thisnicknamewillnotfitatall'
let shortNickname = 'a'
let specialCharactersNickname = 'n!cKn@me'
let repetitiveCharactersNickname = 'haaaaaaaaaary'
let duplicateNickname = 'DuplicateNickChecker'

function checkNickname(nickname, message, buttonState) {
  cy.findByRole('textbox', { name: 'Your nickname' }).clear().type(nickname)
  cy.findByRole('button', { name: 'Confirm' }).should(buttonState)
  if (buttonState == 'be.enabled') {
    cy.findByRole('button', { name: 'Confirm' }).click()
  }
  cy.contains('.dc-field--error', message).should('be.visible')
}

describe.skip('QATEST-2292, QATEST-2316, QATEST-2324, QATEST-2300, QATEST-2308, QATEST-2334 - Verify nickname validation checks during advertiser registration, including duplicates, special characters, length, repetition, and for correct nickname.', () => {
  beforeEach(() => {
    cy.c_createCRAccount({ country_code: 'br' })
    cy.c_login()
    cy.c_navigateToPoiResponsive('Brazil', { runFor: 'p2p' })
    cy.c_verifyAccount()
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('Should be able to set a nickname for P2P in responsive mode.', () => {
    cy.c_navigateToP2P()
    cy.findByText('My profile').should('be.visible').click()
    cy.findByRole('heading', { name: 'What’s your nickname?' }).should(
      'be.visible'
    )
    cy.findByText(
      'Others will see this on your profile, ads, and chats.'
    ).should('be.visible')
    cy.findByText('Your nickname cannot be changed later.').should('be.visible')

    checkNickname(longNickname, 'Nickname is too long', 'be.disabled')
    checkNickname(shortNickname, 'Nickname is too short', 'be.disabled')
    checkNickname(
      specialCharactersNickname,
      'Can only contain letters, numbers, and special characters .- _ @.',
      'be.disabled'
    )
    checkNickname(
      repetitiveCharactersNickname,
      'Cannot repeat a character more than 4 times.',
      'be.disabled'
    )
    checkNickname(
      duplicateNickname,
      'That nickname is taken. Pick another.',
      'be.enabled'
    )
    const advertiserNickname = generateAccountNumberString(10)
    cy.findByRole('textbox', { name: 'Your nickname' })
      .clear()
      .type(advertiserNickname)
    cy.findByRole('button', { name: 'Confirm' }).should('be.enabled').click()
    cy.findByText('Nickname added successfully!').should('be.visible')
    cy.c_closeNotificationHeader()
    cy.get('.my-profile-name__column')
      .children('.dc-text')
      .invoke('text')
      .should('have.text', advertiserNickname)
  })
})
