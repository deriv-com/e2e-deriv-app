import "@testing-library/cypress/add-commands"

function walletsorting(){
  //Fiat Wallet - CRW Sorting in Wallet Carousel 
  const walletTextArray = []
  cy.get('.wallets-add-more__card').each(($element, index, $list) => {
    const wallettext = Cypress.$($element).text()
    const fiatwallet = !wallettext.includes('blockchain')
    const cryptowallet = Cypress.$($element).text().includes('blockchain')
    const Addedcrypto = Cypress.$($element).text().includes('Add')
    
    if (fiatwallet && index > 0) {
      // To check the previous element
      const previousElementButtonText = Cypress.$($list[index - 1]).find('button')
      cy.wrap(previousElementButtonText).should('not.contain.text', 'Added')
      cy.log ("Added Fiat wallet is sorted - displayed first")
    } else if (cryptowallet && Addedcrypto) {
      //const wallettitle = Cypress.$($element).text()
      walletTextArray.push(wallettext.toString())
      cy.log({wallet: wallettext})
      cy.log({walletArray: walletTextArray[1]}) //debugging
      cy.wrap(walletTextArray).as('cryptoArray')
      //return wallettext
    }

  })

  // Log the whole list of Array elements as a JSON string
      cy.log({ walletArray: walletTextArray })
      const expectedSortedList = [...walletTextArray].sort()
      expect(walletTextArray).to.deep.equal(expectedSortedList)
      cy.log({expectedSortedList: expectedSortedList})

}

function addcryptowallet(){
  cy.get('.wallets-add-more__carousel-wrapper')
    .find('button')
    .then((buttons) => {
    const buttoncount = buttons.filter((index, button) => Cypress.$(button).text().trim() === 'Add').length // To get the exact match of the text
    cy.log(`Number of buttons": ${buttoncount}`)
    if (buttoncount >0) {
     cy.log ('Button with text "Add" found') 
     for (let i = buttoncount; i>0; i--) {
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
        
        cy.get('[class*="wallets-accordion wallets-accordion"]')
          .contains(walletname) 
          .should('not.have.class', 'class="wallets-accordion__dropdown"')
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