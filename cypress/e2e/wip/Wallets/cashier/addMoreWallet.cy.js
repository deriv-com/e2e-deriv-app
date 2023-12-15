import "@testing-library/cypress/add-commands"
function walletdefaultsorting(){
cy.contains("Add more Wallets")
cy.findByTestId('dt-wallets-add-more').scrollIntoView()

//To verify if all crypto wallets are sorted in the wallet carousel
cy.get('.wallets-add-more__card')
  .each($element => {
    // Filter wallets that contain only blockchain 
    const walletList = $element.filter((index, element) => {
    const allwalletText = Cypress.$(element).text()
    const cryptoText  = allwalletText.includes('blockchain')
    const wallettoadd = allwalletText.includes('Add')
    if (cryptoText) {
      if(wallettoadd) {
        return allwalletText // It will return the text having crypto and Add
      } else {
        return allwalletText // It will return the text having crypto and not Add
      }
    }
      else if (wallettoadd) {
        return allwalletText // It will return the text having Fiat and Add
      }
       else {
        return allwalletText // It will return the text having Fiat and not Add
       }
    })
  }).toArray()
     //Return only the crypto wallets in the wallet carouse

    // Extract text content of filtered wallets in an Array
    const CarouselList = walletList.map(element => Cypress.$(element).text());
    cy.log({CarouselList: CarouselList})
    //Check if the filtered wallets are sorted alphabetically
    const expectedSortedList = [...CarouselList].sort()
    expect(CarouselList).to.deep.equal(expectedSortedList)
    cy.log({expectedlist: expectedSortedList})
  })
  
// //To verify if all Fiat wallets are sorted in the wallet carousel
  cy.get('.wallets-add-more__card')
    .each($element => {
    // Filter wallets that does contain text "blockchain"
    const fiatwalletList = $element.filter((index, element) => {
    const walletList = Cypress.$(element).text()
    const includesFiat = !walletList.includes('blockchain.');
    const wallettoadd = allwalletText.includes('Add')
    if (includesFiat && wallettoadd)
    {
      return allwalletText
    }
    
    return includesFiat  //Return only the Fiat wallets in the wallet carousel
    })

  // Extract text content of filtered wallets in an Array
    const fiatCarouselList = fiatwalletList.toArray().map(element => Cypress.$(element).text())
    cy.log({fiatCarouselList: fiatCarouselList})
    // Check if the filtered wallets are sorted alphabetically
    const expectedSortedFiatList = [...fiatCarouselList].sort()
    expect(fiatCarouselList).to.deep.equal(expectedSortedFiatList)
    cy.log({expectedlist: expectedSortedFiatList})
  })

}
function addmorewallets(){
  cy.get('.wallets-add-more__card')
  .then(($element) => {
    cy.get($element).findByRole('button', { name: 'Add' }).eq(0).click()
})
}
describe("WALL-3094 - Add wallets from wallets carousels", () => {
    beforeEach(() => {
      cy.c_login("demoonlywallet")
      cy.c_visitResponsive("/wallets", "large")
      cy.contains("Add more Wallets")
      cy.findByTestId('dt-wallets-add-more').scrollIntoView()
    })

it("should be able to see the tour for Demo Only Wallets", () => {
    cy.wait(1000)
    // walletdefaultsorting()
    addmorewallets()
  })
})

