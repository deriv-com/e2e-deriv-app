import '@testing-library/cypress/add-commands'

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

const generateCPFNumber = () => {
  const getRandomDigit = () => Math.floor(Math.random() * 10)
  return `0${getRandomDigit()}${getRandomDigit()}.${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}.${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}-${getRandomDigit()}${getRandomDigit()}`
}

describe.skip('QATEST-2292 - Register a new client as an Advertiser in Deriv P2P - Nickname checks', () => {
  beforeEach(() => {
    cy.c_createRealAccount('br')
    cy.c_login()
    cy.c_navigateToPOI('Brazil')
  })

  it('Should be able to set a nickname for P2P in responsive mode.', () => {
    const CPFDocumentNumber = generateCPFNumber()
    cy.get('select[name="document_type"]').select('CPF')
    cy.findByLabelText('Enter your document number')
      .type(CPFDocumentNumber)
      .should('have.value', CPFDocumentNumber)
    cy.get('.dc-checkbox__box').click()
    cy.findByRole('button', { name: 'Verify' }).click()
    cy.c_rateLimit({
      waitTimeAfterError: 15000,
      isLanguageTest: true,
      maxRetries: 5,
    })
    cy.c_closeNotificationHeader()
    cy.c_visitResponsive('/account/proof-of-identity', 'small')
    cy.contains('ID verification passed').should('be.visible')
    cy.contains('a', 'Continue trading').should('be.visible')
    cy.c_visitResponsive('/cashier/p2p', 'small')
    cy.findByText('Deriv P2P').should('exist')
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

    cy.findByRole('textbox', { name: 'Your nickname' }).type(CPFDocumentNumber)
    cy.findByRole('button', { name: 'Confirm' }).should('be.enabled').click()
    cy.findByText('Nickname added successfully!').should('be.visible')

    cy.c_closeNotificationHeader()
    cy.get('.my-profile-name__column')
      .children('.dc-text')
      .invoke('text')
      .should('have.text', CPFDocumentNumber)
  })
})
