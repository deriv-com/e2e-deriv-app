import "@testing-library/cypress/add-commands"
function addcryptowallet(){
  cy.get('.wallets-add-more__carousel-wrapper')
    .find('button')
    .then((buttons) => {
    const buttoncount = buttons.filter((index, button) => Cypress.$(button).text().trim() === 'Add').length // To get the exact match of the text
    cy.log(`Number of buttons": ${buttoncount}`)
    if (buttoncount >0) {
     cy.log ('Button with text "Add" found') 
     for (let i = buttoncount; i>0; i--) {
      cy.findByTestId('dt-wallets-add-more').scrollIntoView()
      cy.get('.wallets-add-more__card')
        .eq(0)
        .find('button')
        .click()

        let walletname
        //To verify newly added wallet widgets are expanded in dashboard
        cy.get('.wallets-card__details__bottom')
          .find('span')
          .eq(1)
          .invoke('text')
          .then((text) => {
            walletname = text.trim()
            cy.log({wallet: walletname})
            cy.findByRole('button', { name: 'Maybe later' }).click()
            cy.wait(3000)
            cy.findByTestId('dt-wallets-add-more').scrollIntoView()
            cy.findByTestId('dt_themed_scrollbars').then((element) => {
              element.scrollIntoView()
            })
            cy.get('[class*="wallets-add-more__card"]')
          .contains(walletname).find('button')
          .then((button) => {
            expect(button).to.contain('Added')
          })
            })
          }
    } else {
      cy.log('All wallets are already added')
    }
      })
    }
    
describe("WALL-3094 - Add wallets from wallets carousels", () => {
    beforeEach(() => {
      cy.c_login("demoonlywallet")
      cy.c_visitResponsive("/wallets", "large")
    })
  
    it("should be able to add more wallets", () => {
      addcryptowallet()
    })
  })