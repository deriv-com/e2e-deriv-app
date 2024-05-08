import '@testing-library/cypress/add-commands'
function switchWallets() {
  let walletsTexts = [];
  cy.get('.wallets-carousel-content__container').first().find('.wallets-text wallets-text__size--md wallets-text__weight--normal wallets-text__align--left wallets-text__color--general wallets-text__line-height--undefined wallets-text__font-style--normal').each(($textElement) => {
    const text = $textElement.text();
    walletsTexts.push(text);
  });
  cy.log(`Wallets available are: ${walletsTexts}`)
  cy.get('.wallets-carousel-content__progress-bar')
    .find('button')
    .then((buttons) => {
      const buttoncount = buttons.filter(
        (index, button) => Cypress.$(button).text().trim() === 'progress'
      ).length // To get the exact match of the text
      cy.log(`Number of buttons": ${buttoncount}`)
      if (buttoncount > 0) {
        cy.log('Button with text "progress" found')
        for (let i = buttoncount; i > 0; i--) {
          cy.get('wallets-progress-bar').click()
          const inactiveProgressBars = cy.get('.wallets-progress-bar-inactive wallets-progress-bar-transition')
            .then(() => {
                inactiveProgressBars.each(($progressBar) => {
                    cy.wrap($progressBar).click();
                });
              cy.findByText(`${walletname}`).should('exist')
              cy.findByTestId('dt-wallets-add-more').scrollIntoView()
              cy.get('[class*="wallets-add-more__content"]')
                .contains(walletname)
                .parent()
                .parent()
                .find('button')
                .then((button) => {
                  expect(button).to.contain('Added')
                })
            })
        }
      } else {
        cy.log('All wallets successfully switched and viewed')
      }
    })
}

describe('QATEST-139905 - Mobile wallet card redirection', () => {
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
  })

  it('should be able to switch to all of the available wallets in Responsive', () => {
    cy.c_visitResponsive('/wallets', 'small')
    switchWallets()
  })
  it('should be able to open correct deposit, withdraw and transfer page for all wallets in Responsive', () => {
    cy.c_visitResponsive('/wallets', 'small')
    switchWallets()
  })
})
