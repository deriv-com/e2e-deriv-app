function addcryptowallet(platform) {
  cy.get('.wallets-add-more__carousel-wrapper')
    .find('button')
    .then((buttons) => {
      const buttoncount = buttons.filter(
        (index, button) => Cypress.$(button).text().trim() === 'Add'
      ).length // To get the exact match of the text
      cy.log(`Number of buttons": ${buttoncount}`)
      if (buttoncount > 0) {
        cy.log('Button with text "Add" found')
        for (let i = buttoncount; i > 0; i--) {
          cy.findByTestId('dt-wallets-add-more').scrollIntoView()
          cy.get('.wallets-add-more__banner')
            .first({ timeout: 3000 })
            .should('be.visible')
          let walletname
          cy.wait(5000) // this wait is needed as text updated with a slight delay that should be fixed in next phase
          cy.get('.wallets-add-more__content')
            .eq(0)
            .find('span')
            .eq(0)
            .invoke('text')
            .then((text) => {
              walletname = text.trim()
              cy.get('.wallets-add-more__card').eq(0).find('button').click()
              cy.findByRole('button', { name: 'Deposit' }).should('exist')
              cy.findByRole('button', { name: 'Maybe later' }).should('exist')
              if ((buttoncount - i) % 2 === 0) {
                cy.findByRole('button', { name: 'Deposit' }).click()
                cy.findByText(walletname).should('be.visible')
                cy.findByText('Deposit').should('be.visible')
                cy.findByText('Transaction status').should('be.visible')
                cy.findByText(/To avoid loss of funds/).should('be.visible')
                cy.get('.wallets-clipboard').click()
                if (`${platform}` == `desktop`) {
                  cy.findByText('Copied!').should('be.visible')
                }
                cy.findByText('Try Fiat onramp').should('be.visible')
                if (`${platform}` == `mobile`) {
                  cy.get('.header__mobile-drawer-toggle').click()
                }
                cy.findByText("Trader's Hub").click()
              } else {
                cy.findByRole('button', { name: 'Maybe later' }).click()
                cy.wait(3000)
                cy.findByText(`${walletname}`).should('exist')
              }
              cy.findByTestId('dt-wallets-add-more').scrollIntoView()
              cy.get('[class*="wallets-add-more__content"]')
                .contains(walletname)
                .parent()
                .parent()
                .find('button', { timeout: 15000 })
                .then((button) => {
                  expect(button).to.contain('Added')
                })
              if (`${platform}` == `desktop`) {
                checkWalletAccountSwitcher(walletname)
              }
            })
        }
      } else {
        cy.log('All wallets are already added')
      }
    })
}
function checkWalletAccountSwitcher(walletname) {
  cy.get('.wallets-dropdown__button', { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')
  cy.get('.wallets-dropdown__button').click()
  cy.contains(`${walletname}`).should('exist')
}

describe('QATEST-98773 - Add crypto wallet account', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletloginEmail' })
  })

  it('should be able to add more wallets', () => {
    cy.c_visitResponsive('/', 'large')
    addcryptowallet('desktop')
  })
  it('should be able to add more wallets in Responsive', () => {
    cy.c_visitResponsive('/', 'small')
    addcryptowallet('mobile')
  })
})
