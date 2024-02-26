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
      let walletname
      cy.get('.wallets-add-more__content')
        .eq(0)
        .find('span')
        .eq(0)
        .invoke('text')
        .then((text) => {
          walletname = text.trim()
      cy.log(walletname)
      cy.get('.wallets-add-more__card')
        .eq(0)
        .find('button')
        .click()
        cy.findByRole('button', { name: 'Maybe later' }).click()
        //To verify newly added wallet widgets are expanded in dashboard
        cy.findByTestId('dt-wallets-add-more').scrollIntoView()
        cy.wait(3000)
        for (let j = buttoncount; i>j; j++){
          cy.get('[data-testid="dt-wallets-add-more"]').within(()=>{
            cy.get('div[class="wallets-icon-button__icon"]').eq(1).click({ force: true })
          })
        }
        cy.get('[class*="wallets-add-more__content"]')
          .contains(walletname).parent().parent().find('button')
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