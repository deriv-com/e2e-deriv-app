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

   cy.get('@cryptoArray').then((aliasedCryptoArray) => {
    cy.log(`Type of aliasedCryptoArray: ${typeof aliasedCryptoArray}`) //object
    const jsonString = JSON.stringify(aliasedCryptoArray) //converted to string
    cy.log(`Type of aliasedCryptoArray: ${typeof jsonString}`)
    cy.log(`Content of jsonString: ${jsonString}`)

  
    let cryptoArray = jsonString.split(', ')
    cy.log(`Content of cryptoArray: ${cryptoArray}`)

    //sort the array based on the cryptocurrency names
  //   cryptoArray.sort((a, b) => {
  //     const nameA = a.match(/SVGAdded(\w+)/)[1]
  //     const nameB = b.match(/SVGAdded(\w+)/)[1]
  //     return nameA.localeCompare(nameB)
  })
  //   const sortedCryptoString = cryptoArray.join(', ')
  //   console.log(sortedCryptoString)
  // })
  //   const sortedArray = [...cryptoArray].sort(); // Create a sorted copy of the array
  //   cy.wrap(sortedArray).should('deep.equal', cryptoArray);
  // })
  // Log the whole list of Array elements as a JSON string
      // cy.log({ walletArray: cryptoArray })
      //const expectedSortedList = [cryptoArray].sort()
      // expect(cryptoArray).to.deep.equal(expectedSortedList)
      // cy.log({expectedSortedList: expectedSortedList})

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
      cy.findByTestId('dt-wallets-add-more').scrollIntoView()
      let walletname
      cy.get('.wallets-add-more__content')
        .eq(0)
        .find('span')
        .eq(0)
        .invoke('text')
        .then((text) => {
          walletname = text.trim()
      cy.get('.wallets-add-more__card')
        .eq(0)
        .find('button')
        .click()
        cy.findByRole('button', { name: 'Maybe later' }).click()
        cy.findByText(`${walletname}`).should("exist")
        cy.findByTestId('dt-wallets-add-more').scrollIntoView()
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
      walletsorting()
    })
  })