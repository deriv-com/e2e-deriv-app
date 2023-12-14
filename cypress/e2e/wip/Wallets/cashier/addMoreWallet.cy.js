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
    return allwalletText.includes('blockchain.')  //Return only the crypto wallets in the wallet carousel
    }).toArray()

    // Extract text content of filtered wallets in an Array
    const CarouselList = walletList.map(element => Cypress.$(element).text());
    cy.log({CarouselList: CarouselList})
    //Check if the filtered wallets are sorted alphabetically
    const expectedSortedList = [...CarouselList].sort();
    expect(CarouselList).to.deep.equal(expectedSortedList);
    cy.log({expectedlist: expectedSortedList})
  })
  
// //To verify if all Fiat wallets are sorted in the wallet carousel
  cy.get('.wallets-add-more__card')
    .each($element => {
    // Filter wallets that does contain text "blockchain"
    const fiatwalletList = $element.filter((index, element) => {
    const walletList = Cypress.$(element).text()
    const includesFiat = !walletList.includes('blockchain.');
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

describe("WALL-3094 - Add wallets from wallets carousels", () => {
    beforeEach(() => {
      cy.c_login("demoonlywallet")
      cy.c_visitResponsive("/wallets", "large")
    })

it("should be able to see the tour for Demo Only Wallets", () => {
    cy.wait(1000)
    walletdefaultsorting()
  })
})

